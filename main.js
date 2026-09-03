'use strict';

var obsidian = require('obsidian');

var VIEW_TYPE = 'csv';

function needsQuote(s, delim) {
  var d = delim || ',';
  if (s.indexOf('"') !== -1 || s.indexOf('\n') !== -1 || s.indexOf('\r') !== -1 || s.indexOf(d) !== -1) {
    return true;
  }
  // Excel in DE/EU uses ';' and still quotes fields that contain ','
  if (d === ';' && s.indexOf(',') !== -1) {
    return true;
  }
  return false;
}

function detectDelimiter(text) {
  var raw = String(text || '').replace(/^\uFEFF/, '');
  var counts = { ',': 0, ';': 0, '\t': 0 };
  var inQuotes = false;
  var lines = 0;
  for (var i = 0; i < raw.length && lines < 20; i++) {
    var c = raw[i];
    var n = raw[i + 1];
    if (inQuotes) {
      if (c === '"' && n === '"') {
        i++;
      } else if (c === '"') {
        inQuotes = false;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',' || c === ';' || c === '\t') {
      counts[c]++;
    } else if (c === '\n' || (c === '\r' && n !== '\n')) {
      lines++;
    }
  }
  var best = ',';
  var bestN = counts[','];
  if (counts[';'] > bestN) {
    best = ';';
    bestN = counts[';'];
  }
  if (counts['\t'] > bestN) {
    best = '\t';
  }
  return best;
}

function parseDelimited(text, delim) {
  var d = delim || ',';
  var raw = String(text || '').replace(/^\uFEFF/, '');
  if (!raw.length) {
    return { rows: [], quoteAll: false };
  }
  var rows = [];
  var row = [];
  var cell = '';
  var inQuotes = false;
  var cellQuoted = false;
  var quoteAllVotes = 0;
  var quoteMinVotes = 0;

  function finishCell() {
    if (cellQuoted) {
      if (!needsQuote(cell, d)) {
        quoteAllVotes++;
      }
    } else {
      quoteMinVotes++;
    }
    row.push(cell);
    cell = '';
    cellQuoted = false;
  }

  for (var i = 0; i < raw.length; i++) {
    var c = raw[i];
    var n = raw[i + 1];
    if (inQuotes) {
      if (c === '"' && n === '"') {
        cell += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        cell += c;
      }
    } else if (c === '"') {
      inQuotes = true;
      cellQuoted = true;
    } else if (c === d) {
      finishCell();
    } else if (c === '\n' || (c === '\r' && n !== '\n')) {
      finishCell();
      rows.push(row);
      row = [];
    } else if (c !== '\r') {
      cell += c;
    }
  }
  if (cell.length || row.length || rows.length === 0 || cellQuoted) {
    finishCell();
    rows.push(row);
  }
  return { rows: rows, quoteAll: quoteAllVotes > quoteMinVotes };
}

function parseCsv(text, delim) {
  return parseDelimited(text, delim || ',');
}

function parseClipboardTable(text) {
  var raw = String(text || '').replace(/^\uFEFF/, '');
  if (!raw.length) {
    return [];
  }
  if (raw.indexOf('\t') !== -1) {
    return parseDelimited(raw, '\t').rows;
  }
  return parseDelimited(raw, detectDelimiter(raw)).rows;
}

function isMultiCell(rows) {
  if (!rows || !rows.length) {
    return false;
  }
  if (rows.length > 1) {
    return true;
  }
  return !!(rows[0] && rows[0].length > 1);
}

function htmlCellText(el) {
  var s = '';
  try {
    s = el.innerText != null ? String(el.innerText) : String(el.textContent || '');
  } catch (e) {
    s = '';
  }
  return s.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\u00a0/g, ' ').replace(/\n+$/g, '');
}

function parseHtmlTable(html) {
  var raw = String(html || '');
  if (!raw || raw.toLowerCase().indexOf('<table') === -1) {
    return [];
  }
  var doc;
  try {
    doc = new DOMParser().parseFromString(raw, 'text/html');
  } catch (e) {
    return [];
  }
  if (!doc) {
    return [];
  }
  var tables = doc.querySelectorAll('table');
  var best = [];
  var bestScore = 0;
  var t;
  for (t = 0; t < tables.length; t++) {
    var rows = [];
    var trs = tables[t].querySelectorAll('tr');
    var i;
    for (i = 0; i < trs.length; i++) {
      var cells = trs[i].querySelectorAll('th, td');
      if (!cells.length) {
        continue;
      }
      var row = [];
      var j;
      for (j = 0; j < cells.length; j++) {
        row.push(htmlCellText(cells[j]));
      }
      rows.push(row);
    }
    var score = rows.length * colCountOf(rows);
    if (score > bestScore) {
      best = rows;
      bestScore = score;
    }
  }
  return best;
}

function parseClipboardToRows(text, html) {
  var fromText = [];
  var fromHtml = [];
  try {
    fromText = parseClipboardTable(text);
  } catch (e) {
    fromText = [];
  }
  if (isMultiCell(fromText)) {
    return fromText;
  }
  try {
    fromHtml = parseHtmlTable(html);
  } catch (e) {
    fromHtml = [];
  }
  if (isMultiCell(fromHtml)) {
    return fromHtml;
  }
  if (fromText && fromText.length) {
    return fromText;
  }
  return fromHtml && fromHtml.length ? fromHtml : [];
}

function padAllRows(rows) {
  var cols = colCountOf(rows);
  var i;
  for (i = 0; i < rows.length; i++) {
    while (rows[i].length < cols) {
      rows[i].push('');
    }
  }
}

function detectNewline(text) {
  var s = String(text || '');
  if (s.indexOf('\r\n') !== -1) {
    return '\r\n';
  }
  if (s.indexOf('\r') !== -1) {
    return '\r';
  }
  return '\n';
}

function hasTrailingNewline(text) {
  var s = String(text || '');
  return /[\r\n]$/.test(s);
}

function hasBom(text) {
  return String(text || '').charAt(0) === '\uFEFF';
}

function serializeDelimited(rows, delim, newline, quoteAll) {
  var d = delim || ',';
  var nl = newline || '\n';
  return rows
    .map(function (row) {
      return row
        .map(function (cell) {
          var s = String(cell == null ? '' : cell);
          if (quoteAll || needsQuote(s, d)) {
            return '"' + s.replace(/"/g, '""') + '"';
          }
          return s;
        })
        .join(d);
    })
    .join(nl);
}

function serializeCsv(rows, newline) {
  return serializeDelimited(rows, ',', newline, false);
}

function formatCsvFile(rows, opts) {
  opts = opts || {};
  var nl = opts.newline || '\n';
  var delim = opts.delim || ',';
  var out = serializeDelimited(rows, delim, nl, !!opts.quoteAll);
  if (opts.trailingNewline && rows.length) {
    out += nl;
  }
  if (opts.bom) {
    out = '\uFEFF' + out;
  }
  return out;
}

function serializeTsv(rows) {
  return serializeDelimited(rows, '\t');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function rowsToHtmlTable(rows) {
  return (
    '<table>' +
    rows
      .map(function (row) {
        return (
          '<tr>' +
          row
            .map(function (cell) {
              return '<td>' + escapeHtml(cell == null ? '' : cell) + '</td>';
            })
            .join('') +
          '</tr>'
        );
      })
      .join('') +
    '</table>'
  );
}

function fallbackCopyText(text) {
  var ta = document.body.createEl('textarea', {
    cls: 'table-csv-copy-fallback',
    attr: { readonly: 'readonly' },
  });
  ta.value = text;
  ta.select();
  var ok = document.execCommand('copy');
  ta.remove();
  if (!ok) {
    throw new Error('execCommand copy failed');
  }
}

function colCountOf(rows) {
  var n = 1;
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].length > n) {
      n = rows[i].length;
    }
  }
  return n;
}

function emptyRow(cols) {
  var r = [];
  for (var i = 0; i < cols; i++) {
    r.push('');
  }
  return r;
}

function cellSortKey(v) {
  return String(v == null ? '' : v).trim();
}

function normalizeFilterText(s) {
  var t = String(s == null ? '' : s);
  try {
    t = t.normalize('NFC');
  } catch (e) {
    /* ignore */
  }
  return t.trim().toLowerCase();
}

function sortLocales() {
  var list = [];
  try {
    if (typeof navigator !== 'undefined' && navigator.languages && navigator.languages.length) {
      for (var i = 0; i < navigator.languages.length; i++) {
        list.push(navigator.languages[i]);
      }
    } else if (typeof navigator !== 'undefined' && navigator.language) {
      list.push(navigator.language);
    }
  } catch (e) {
    /* ignore */
  }
  list.push('ja', 'de', 'zh-Hans', 'zh-Hant', 'ko', 'en');
  return list;
}

function isGermanNumeric() {
  try {
    if (uiLang() === 'de') {
      return true;
    }
  } catch (e) {
    /* ignore */
  }
  var list = sortLocales();
  for (var i = 0; i < list.length; i++) {
    if (String(list[i]).toLowerCase().startsWith('de')) {
      return true;
    }
  }
  return false;
}

function parseSortNumber(s) {
  var raw = String(s == null ? '' : s).trim();
  if (!raw) {
    return { ok: false, n: NaN };
  }
  var t = raw;
  if (isGermanNumeric()) {
    if (t.indexOf(',') !== -1) {
      t = t.replace(/\./g, '').replace(',', '.');
    } else if (/^-?\d{1,3}(\.\d{3})+$/.test(t)) {
      t = t.replace(/\./g, '');
    }
  } else {
    t = t.replace(/,/g, '');
  }
  var n = Number(t);
  return {
    ok: t !== '' && Number.isFinite(n) && /^-?\d+(\.\d+)?$/.test(t),
    n: n,
  };
}

function compareCells(a, b) {
  var sa = cellSortKey(a);
  var sb = cellSortKey(b);
  if (!sa && !sb) {
    return 0;
  }
  if (!sa) {
    return 1;
  }
  if (!sb) {
    return -1;
  }
  var na = parseSortNumber(sa);
  var nb = parseSortNumber(sb);
  if (na.ok && nb.ok) {
    return na.n - nb.n;
  }
  try {
    sa = sa.normalize('NFC');
    sb = sb.normalize('NFC');
  } catch (e) {
    /* ignore */
  }
  return sa.localeCompare(sb, sortLocales(), { numeric: true, sensitivity: 'base' });
}

function ensureCell(rows, r, c) {
  while (rows.length <= r) {
    rows.push([]);
  }
  while (rows[r].length <= c) {
    rows[r].push('');
  }
}

class TableCsvView extends obsidian.TextFileView {
  constructor(leaf) {
    super(leaf);
    this.filter = '';
    this.mode = 'view';
    this.rows = [];
    this.selRow = 0;
    this.selCol = 0;
    this.sortCol = null;
    this.sortDir = null;
    this.pinLastRow = false;
    this.pinFirstCol = false;
    this.filterComposing = false;
    this.keepFilterFocus = false;
    this.filterCaret = null;
    this.newline = '\n';
    this.trailingNewline = false;
    this.bom = false;
    this.delim = ',';
    this.quoteAll = false;
    this.leafHostEl = null;
  }

  syncViewLeafClass() {
    try {
      var host =
        this.containerEl && this.containerEl.closest
          ? this.containerEl.closest('.workspace-leaf-content')
          : null;
      if (!host) {
        return;
      }
      this.leafHostEl = host;
      host.toggleClass('is-csv-view-mode', this.mode === 'view' || this.mode === 'edit');
    } catch (e) {
      /* ignore */
    }
  }

  async onOpen() {
    await super.onOpen();
    var self = this;
    this.register(function () {
      try {
        if (self.leafHostEl) {
          self.leafHostEl.removeClass('is-csv-view-mode');
        }
      } catch (e) {
        /* ignore */
      }
    });
    this.registerDomEvent(this.contentEl, 'paste', function (ev) {
      if (self.mode !== 'edit') {
        return;
      }
      try {
        var text = ev.clipboardData ? ev.clipboardData.getData('text/plain') : '';
        var html = ev.clipboardData ? ev.clipboardData.getData('text/html') : '';
        var rows = parseClipboardToRows(text, html);
        if (!isMultiCell(rows)) {
          return;
        }
        ev.preventDefault();
        self.applyClipboardRows(rows);
      } catch (e) {
        /* keep native paste so a cell is not left empty */
      }
    });
  }

  getViewType() {
    return VIEW_TYPE;
  }

  getDisplayText() {
    return this.file ? this.file.basename : 'CSV';
  }

  formatCurrent() {
    return formatCsvFile(this.rows, {
      newline: this.newline,
      trailingNewline: this.trailingNewline,
      bom: this.bom,
      delim: this.delim,
      quoteAll: this.quoteAll,
    });
  }

  getViewData() {
    var next = this.formatCurrent();
    if (next === this.data) {
      return this.data;
    }
    return next;
  }

  setViewData(data, clear) {
    this.data = data;
    this.newline = detectNewline(data);
    this.trailingNewline = hasTrailingNewline(data);
    this.bom = hasBom(data);
    this.delim = detectDelimiter(data);
    var parsed = parseCsv(data, this.delim);
    this.rows = parsed.rows;
    this.quoteAll = parsed.quoteAll;
    if (clear) {
      this.filter = '';
      this.mode = 'view';
      this.selRow = 0;
      this.selCol = 0;
      this.sortCol = null;
      this.sortDir = null;
    }
    this.render();
  }

  clear() {
    this.data = '';
    this.rows = [];
    this.newline = '\n';
    this.trailingNewline = false;
    this.bom = false;
    this.delim = ',';
    this.quoteAll = false;
    this.contentEl.empty();
  }

  persist() {
    var next = this.formatCurrent();
    if (next === this.data) {
      return;
    }
    this.data = next;
    this.requestSave();
  }

  rowsForCopy() {
    if (this.mode === 'view') {
      var header = this.rows.length ? [this.rows[0]] : [];
      var body = this.visibleBody().map(function (item) {
        return item.row;
      });
      return header.concat(body);
    }
    return this.rows;
  }

  async copyTable() {
    var rows = this.rowsForCopy();
    if (!rows.length) {
      new obsidian.Notice(t('コピーするものがありません', 'Nothing to copy', 'Nichts zu kopieren'));
      return;
    }
    var tsv = serializeTsv(rows);
    var html = rowsToHtmlTable(rows);
    try {
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': new Blob([tsv], { type: 'text/plain' }),
            'text/html': new Blob([html], { type: 'text/html' }),
          }),
        ]);
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(tsv);
      } else {
        fallbackCopyText(tsv);
      }
      new obsidian.Notice(t('表をコピーしました', 'Copied table', 'Tabelle kopiert'));
    } catch (e) {
      try {
        fallbackCopyText(tsv);
        new obsidian.Notice(t('表をコピーしました', 'Copied table', 'Tabelle kopiert'));
      } catch (e2) {
        new obsidian.Notice(t('コピーに失敗しました', 'Copy failed', 'Kopieren fehlgeschlagen'));
      }
    }
  }

  async exportFiltered() {
    if (this.mode !== 'view') {
      new obsidian.Notice(
        t(
          '書き出すには閲覧モードに切り替えてください',
          'Switch to View to export',
          'Zum Exportieren in den Ansicht-Modus wechseln',
        ),
      );
      return;
    }
    if (!this.file) {
      new obsidian.Notice(
        t('書き出すファイルがありません', 'No file to export from', 'Keine Datei zum Exportieren'),
      );
      return;
    }
    var rows = this.rowsForCopy();
    if (!rows.length) {
      new obsidian.Notice(
        t('書き出すものがありません', 'Nothing to export', 'Nichts zu exportieren'),
      );
      return;
    }
    var suffix = t('-絞り込み', '-filtered', '-gefiltert');
    var path = uniqueSiblingCsvPath(this.app.vault, this.file, suffix);
    var body = formatCsvFile(rows, {
      newline: this.newline,
      trailingNewline: this.trailingNewline,
      bom: this.bom,
      delim: this.delim,
      quoteAll: this.quoteAll,
    });
    try {
      var file = await this.app.vault.create(path, body);
      var leaf = this.app.workspace.getLeaf(true);
      await leaf.openFile(file);
      var n = Math.max(0, rows.length - 1);
      new obsidian.Notice(
        t(
          n + '行を新しいCSVに書き出しました',
          'Exported ' + n + ' rows to a new CSV',
          n + ' Zeilen in eine neue CSV exportiert',
        ),
      );
    } catch (e) {
      new obsidian.Notice(
        t('書き出せませんでした', 'Could not export CSV', 'CSV konnte nicht exportiert werden'),
      );
    }
  }

  async readClipboardPayload() {
    var text = '';
    var html = '';
    try {
      if (navigator.clipboard && typeof navigator.clipboard.read === 'function') {
        var items = await navigator.clipboard.read();
        var i;
        for (i = 0; i < items.length; i++) {
          var item = items[i];
          var types = item.types || [];
          if (!html && types.indexOf('text/html') !== -1) {
            html = await (await item.getType('text/html')).text();
          }
          if (!text && types.indexOf('text/plain') !== -1) {
            text = await (await item.getType('text/plain')).text();
          }
        }
      }
    } catch (e) {
      /* fall through to readText */
    }
    if (!text) {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          text = await navigator.clipboard.readText();
        }
      } catch (e2) {
        throw e2;
      }
    }
    return { text: text, html: html };
  }

  async pasteTable() {
    if (this.mode !== 'edit') {
      new obsidian.Notice(t('貼り付けるには編集モードに切り替えてください', 'Switch to Edit to paste', 'Zum Einfügen in den Bearbeiten-Modus wechseln'));
      return;
    }
    var payload;
    try {
      payload = await this.readClipboardPayload();
    } catch (e) {
      new obsidian.Notice(t('クリップボードを読めませんでした', 'Could not read clipboard', 'Zwischenablage konnte nicht gelesen werden'));
      return;
    }
    this.applyClipboardRows(parseClipboardToRows(payload.text, payload.html));
  }

  applyClipboardRows(rows) {
    if (!rows || !rows.length) {
      new obsidian.Notice(t('クリップボードが空です', 'Clipboard is empty', 'Zwischenablage ist leer'));
      return;
    }
    try {
      this.pasteAtSelection(rows);
      this.persist();
      this.render();
      new obsidian.Notice(t('表を貼り付けました', 'Pasted table', 'Tabelle eingefügt'));
    } catch (e) {
      new obsidian.Notice(t('貼り付けに失敗しました', 'Paste failed', 'Einfügen fehlgeschlagen'));
    }
  }

  pasteAtSelection(block) {
    var startR = this.rows.length ? Math.max(0, this.selRow) : 0;
    var startC = this.rows.length ? Math.max(0, this.selCol) : 0;
    var i;
    var j;
    for (i = 0; i < block.length; i++) {
      var row = block[i] || [];
      for (j = 0; j < row.length; j++) {
        ensureCell(this.rows, startR + i, startC + j);
        this.rows[startR + i][startC + j] = String(row[j] == null ? '' : row[j]);
      }
    }
    padAllRows(this.rows);
  }

  setMode(mode) {
    if (mode === this.mode) {
      return;
    }
    if (mode === 'edit') {
      this.filter = '';
      this.sortCol = null;
      this.sortDir = null;
    } else {
      this.persist();
    }
    this.mode = mode;
    this.render();
  }

  insertRow() {
    var cols = colCountOf(this.rows);
    var at = this.rows.length ? this.selRow + 1 : 0;
    if (!this.rows.length) {
      cols = 1;
      at = 0;
    }
    this.rows.splice(at, 0, emptyRow(cols));
    this.selRow = at;
    this.persist();
    this.render();
  }

  deleteRow() {
    if (!this.rows.length) {
      return;
    }
    if (this.rows.length === 1) {
      this.rows[0] = emptyRow(Math.max(1, this.rows[0].length));
    } else {
      this.rows.splice(this.selRow, 1);
      if (this.selRow >= this.rows.length) {
        this.selRow = this.rows.length - 1;
      }
    }
    this.persist();
    this.render();
  }

  insertCol() {
    var at = this.selCol + 1;
    if (!this.rows.length) {
      this.rows.push(['', '']);
      this.selCol = 1;
    } else {
      for (var i = 0; i < this.rows.length; i++) {
        while (this.rows[i].length < at) {
          this.rows[i].push('');
        }
        this.rows[i].splice(at, 0, '');
      }
      this.selCol = at;
    }
    this.persist();
    this.render();
  }

  deleteCol() {
    if (!this.rows.length) {
      return;
    }
    var cols = colCountOf(this.rows);
    var i;
    if (cols <= 1) {
      for (i = 0; i < this.rows.length; i++) {
        this.rows[i] = [''];
      }
      this.selCol = 0;
    } else {
      for (i = 0; i < this.rows.length; i++) {
        if (this.rows[i].length > this.selCol) {
          this.rows[i].splice(this.selCol, 1);
        }
      }
      if (this.selCol >= cols - 1) {
        this.selCol = cols - 2;
      }
    }
    this.persist();
    this.render();
  }

  visibleBody() {
    var rows = this.rows;
    if (!rows.length) {
      return [];
    }
    var q = normalizeFilterText(this.filter);
    var body = rows.slice(1);
    var out;
    if (!q) {
      out = body.map(function (r, i) {
        return { row: r, index: i + 1 };
      });
    } else {
      out = [];
      for (var i = 0; i < body.length; i++) {
        var r = body[i];
        var hit = r.some(function (v) {
          return normalizeFilterText(v).includes(q);
        });
        if (hit) {
          out.push({ row: r, index: i + 1 });
        }
      }
    }
    if (this.pinLastRow && rows.length > 1) {
      var lastIndex = rows.length - 1;
      var sortable = [];
      var pinned = null;
      for (var j = 0; j < out.length; j++) {
        if (out[j].index === lastIndex) {
          pinned = out[j];
        } else {
          sortable.push(out[j]);
        }
      }
      out = this.sortBody(sortable);
      if (pinned) {
        out = out.concat([pinned]);
      }
      return out;
    }
    return this.sortBody(out);
  }

  sortBody(items) {
    if (this.sortCol == null || !this.sortDir) {
      return items;
    }
    var col = this.sortCol;
    var dir = this.sortDir === 'desc' ? -1 : 1;
    return items.slice().sort(function (a, b) {
      return compareCells(a.row[col], b.row[col]) * dir;
    });
  }

  cycleSort(col) {
    if (this.sortCol === col) {
      if (this.sortDir === 'asc') {
        this.sortDir = 'desc';
      } else if (this.sortDir === 'desc') {
        this.sortCol = null;
        this.sortDir = null;
      } else {
        this.sortDir = 'asc';
      }
    } else {
      this.sortCol = col;
      this.sortDir = 'asc';
    }
    this.render();
  }

  applyFilterInput(input) {
    this.filter = input.value || '';
    this.filterCaret = input.selectionStart;
    this.keepFilterFocus = true;
    this.render();
  }

  render() {
    var el = this.contentEl;
    var self = this;
    el.empty();
    el.addClass('table-csv-view');
    el.toggleClass('is-edit', this.mode === 'edit');
    el.toggleClass('is-view', this.mode === 'view');
    el.toggleClass('is-pin-first-col', this.mode === 'view' && this.pinFirstCol);
    this.syncViewLeafClass();

    var toolbar = el.createDiv({ cls: 'table-csv-toolbar' });
    var viewBtn = toolbar.createEl('button', { text: t('閲覧', 'View', 'Ansicht'), type: 'button' });
    var editBtn = toolbar.createEl('button', { text: t('編集', 'Edit', 'Bearbeiten'), type: 'button' });
    viewBtn.toggleClass('mod-cta', this.mode === 'view');
    editBtn.toggleClass('mod-cta', this.mode === 'edit');
    viewBtn.addEventListener('click', function () {
      self.setMode('view');
    });
    editBtn.addEventListener('click', function () {
      self.setMode('edit');
    });

    var copyBtn = toolbar.createEl('button', { text: t('コピー', 'Copy', 'Kopieren'), type: 'button' });
    copyBtn.addEventListener('click', function () {
      self.copyTable();
    });

    if (this.mode === 'view') {
      var exportBtn = toolbar.createEl('button', {
        text: t('絞り込みを書き出す', 'Export filtered', 'Filter exportieren'),
        type: 'button',
      });
      exportBtn.setAttribute(
        'title',
        t(
          '見出しと、いま表示している行を新しいCSVにします。元のファイルは変わりません',
          'Save the header plus currently visible rows as a new CSV. The original file is unchanged',
          'Kopfzeile und derzeit sichtbare Zeilen als neue CSV speichern. Die Originaldatei bleibt unverändert',
        ),
      );
      exportBtn.addEventListener('click', function () {
        void self.exportFiltered();
      });
    }

    var bmcBtn = toolbar.createEl('button', {
      cls: 'table-csv-bmc-btn',
      text: t('☕ Buy Me a Coffee', '☕ Buy Me a Coffee', '☕ Buy Me a Coffee'),
      type: 'button',
    });
    bmcBtn.addEventListener('click', function () {
      window.open(BMC_URL, '_blank');
    });

    if (this.mode === 'view') {
      var pinWrap = toolbar.createDiv({ cls: 'table-csv-pin-last' });
      var pinLabel = pinWrap.createEl('label');
      var pinCheck = pinLabel.createEl('input', { type: 'checkbox' });
      pinCheck.checked = this.pinLastRow;
      pinLabel.createSpan({
        text: t('最下行を固定', 'Pin last row', 'Letzte Zeile anheften'),
      });
      pinCheck.setAttribute(
        'title',
        t(
          '合計行など最後の1行を並べ替え対象外にし、常に表の下に表示します',
          'Keep the last row (e.g. totals) out of sort and always at the bottom',
          'Die letzte Zeile (z. B. Summen) nicht sortieren und immer unten anzeigen',
        ),
      );
      pinCheck.addEventListener('change', function () {
        self.pinLastRow = pinCheck.checked;
        self.render();
      });

      var pinFirstWrap = toolbar.createDiv({ cls: 'table-csv-pin-first' });
      var pinFirstLabel = pinFirstWrap.createEl('label');
      var pinFirstCheck = pinFirstLabel.createEl('input', { type: 'checkbox' });
      pinFirstCheck.checked = this.pinFirstCol;
      pinFirstLabel.createSpan({
        text: t('先頭列を固定', 'Pin first column', 'Erste Spalte anheften'),
      });
      pinFirstCheck.setAttribute(
        'title',
        t(
          '横にスクロールしても、左端の列（店舗名など）を画面に残します',
          'Keep the leftmost column visible when scrolling sideways',
          'Die linke Spalte beim seitlichen Scrollen sichtbar halten',
        ),
      );
      pinFirstCheck.addEventListener('change', function () {
        self.pinFirstCol = pinFirstCheck.checked;
        self.render();
      });

      var input = toolbar.createEl('input', {
        type: 'search',
        attr: {
          placeholder: t('絞り込み', 'Filter', 'Filter'),
          spellcheck: 'false',
          autocomplete: 'off',
        },
      });
      input.value = this.filter || '';
      input.addEventListener('compositionstart', function () {
        self.filterComposing = true;
      });
      input.addEventListener('compositionend', function () {
        self.filterComposing = false;
        self.applyFilterInput(input);
      });
      input.addEventListener('input', function (ev) {
        self.filter = input.value || '';
        if (ev.isComposing || self.filterComposing) {
          return;
        }
        self.applyFilterInput(input);
      });
      if (this.keepFilterFocus) {
        this.keepFilterFocus = false;
        input.focus();
        var pos = this.filterCaret;
        if (typeof pos === 'number') {
          try {
            var len = input.value.length;
            var caret = Math.max(0, Math.min(len, pos));
            input.setSelectionRange(caret, caret);
          } catch (e) {
            /* ignore */
          }
        }
      }
    } else {
      var pasteBtn = toolbar.createEl('button', { text: t('貼り付け', 'Paste', 'Einfügen'), type: 'button' });
      pasteBtn.addEventListener('click', function () {
        void self.pasteTable();
      });
      var insertRowBtn = toolbar.createEl('button', { text: t('行を追加', 'Insert row', 'Zeile einfügen'), type: 'button' });
      var deleteRowBtn = toolbar.createEl('button', { text: t('行を削除', 'Delete row', 'Zeile löschen'), type: 'button' });
      var insertColBtn = toolbar.createEl('button', { text: t('列を追加', 'Insert column', 'Spalte einfügen'), type: 'button' });
      var deleteColBtn = toolbar.createEl('button', { text: t('列を削除', 'Delete column', 'Spalte löschen'), type: 'button' });
      insertRowBtn.addEventListener('click', function () {
        self.insertRow();
      });
      deleteRowBtn.addEventListener('click', function () {
        self.deleteRow();
      });
      insertColBtn.addEventListener('click', function () {
        self.insertCol();
      });
      deleteColBtn.addEventListener('click', function () {
        self.deleteCol();
      });
    }

    var rows = this.rows;
    var cols = rows.length ? colCountOf(rows) : 0;
    var body = this.mode === 'view' ? this.visibleBody() : [];
    var total = Math.max(0, rows.length - 1);
    var shown = this.mode === 'view' ? body.length : total;
    var path = this.file ? this.file.path : t('(未保存)', '(unsaved)', '(ungespeichert)');
    var modeLabel =
      this.mode === 'edit'
        ? t('編集', 'edit', 'Bearbeiten')
        : t('閲覧', 'view', 'Ansicht');
    el.createDiv({
      cls: 'table-csv-meta',
      text: path + ' — ' + modeLabel + ' — ' + shown + ' / ' + total,
    });

    if (!rows.length) {
      el.createEl('p', {
        text:
          this.mode === 'edit'
            ? t('空のCSVです。行を追加して始めてください。', 'Empty CSV. Insert a row to start.', 'Leere CSV. Zum Starten eine Zeile einfügen.')
            : t('空のCSV', 'Empty CSV', 'Leere CSV'),
      });
      return;
    }

    var scroll = el.createDiv({ cls: 'table-csv-scroll' });
    var table = scroll.createEl('table', { cls: 'table-csv-table' });
    var thead = table.createEl('thead');
    var hr = thead.createEl('tr');
    if (this.mode === 'edit') {
      hr.createEl('th', { cls: 'table-csv-gutter', text: '' });
    }
    var c;
    for (c = 0; c < cols; c++) {
      var headVal = String(rows[0][c] == null ? '' : rows[0][c]);
      if (this.mode === 'edit') {
        var th = hr.createEl('th');
        th.toggleClass('is-selected', this.selRow === 0 && this.selCol === c);
        this.bindCell(th, 0, c, headVal, true);
      } else {
        (function (colIndex) {
          var label = headVal;
          if (self.sortCol === colIndex) {
            label += self.sortDir === 'desc' ? ' ▼' : ' ▲';
          }
          var thView = hr.createEl('th', {
            cls: 'table-csv-sortable',
            text: label,
            attr: {
              title: t('クリックで並べ替え', 'Click to sort', 'Zum Sortieren klicken'),
            },
          });
          thView.toggleClass('is-sorted', self.sortCol === colIndex);
          thView.toggleClass('is-frozen-col', self.pinFirstCol && colIndex === 0);
          thView.addEventListener('click', function () {
            self.cycleSort(colIndex);
          });
        })(c);
      }
    }

    var tbody = table.createEl('tbody');
    if (this.mode === 'edit') {
      for (var r = 1; r < rows.length; r++) {
        this.renderEditRow(tbody, r, cols);
      }
    } else {
      var lastPinnedIndex =
        self.pinLastRow && rows.length > 1 ? rows.length - 1 : null;
      body.forEach(function (item) {
        var tr = tbody.createEl('tr');
        tr.toggleClass('is-pinned', lastPinnedIndex != null && item.index === lastPinnedIndex);
        for (var i = 0; i < cols; i++) {
          var val = String(item.row[i] == null ? '' : item.row[i]);
          var td = tr.createEl('td', { text: val, attr: { title: val } });
          td.toggleClass('is-frozen-col', self.pinFirstCol && i === 0);
        }
      });
    }
  }

  renderEditRow(tbody, r, cols) {
    var tr = tbody.createEl('tr');
    var gutter = tr.createEl('th', {
      cls: 'table-csv-gutter',
      text: String(r),
    });
    var self = this;
    gutter.addEventListener('click', function () {
      self.selRow = r;
      self.render();
    });
    for (var c = 0; c < cols; c++) {
      var val = String(this.rows[r][c] == null ? '' : this.rows[r][c]);
      var td = tr.createEl('td');
      td.toggleClass('is-selected', this.selRow === r && this.selCol === c);
      this.bindCell(td, r, c, val, false);
    }
  }

  bindCell(host, r, c, val, isHeader) {
    var self = this;
    var field = host.createEl('input', {
      type: 'text',
      cls: isHeader ? 'table-csv-cell-input is-header' : 'table-csv-cell-input',
      attr: { title: val },
    });
    field.value = val;
    field.addEventListener('focus', function () {
      self.selRow = r;
      self.selCol = c;
      self.contentEl.querySelectorAll('.is-selected').forEach(function (n) {
        n.removeClass('is-selected');
      });
      host.addClass('is-selected');
    });
    field.addEventListener('input', function () {
      ensureCell(self.rows, r, c);
      self.rows[r][c] = field.value;
      field.setAttribute('title', field.value);
    });
    field.addEventListener('change', function () {
      self.persist();
    });
    field.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        field.blur();
      }
    });
  }
}

var BMC_URL = 'https://buymeacoffee.com/k_tech_studio';

function uiLang() {
  try {
    var lang = '';
    if (typeof obsidian.getLanguage === 'function') {
      lang = String(obsidian.getLanguage() || '').toLowerCase();
    }
    if (lang.startsWith('ja')) {
      return 'ja';
    }
    if (lang.startsWith('de')) {
      return 'de';
    }
  } catch (e) {
    /* ignore */
  }
  return 'en';
}

function t(ja, en, de) {
  var lang = uiLang();
  if (lang === 'ja') {
    return ja;
  }
  if (lang === 'de') {
    return de || en;
  }
  return en;
}

function joinVaultPath(folderPath, name) {
  if (!folderPath || folderPath === '/') {
    return name;
  }
  return folderPath.replace(/\/$/, '') + '/' + name;
}

function uniqueSiblingCsvPath(vault, file, suffix) {
  var parent = file && file.parent;
  var folderPath = !parent || parent.path === '/' ? '' : parent.path;
  var base = file && file.basename ? file.basename : 'Untitled';
  var n = 0;
  while (true) {
    var name = n === 0 ? base + suffix + '.csv' : base + suffix + ' ' + n + '.csv';
    var path = joinVaultPath(folderPath, name);
    if (!vault.getAbstractFileByPath(path)) {
      return path;
    }
    n++;
  }
}

function uniqueCsvPath(vault, folderPath) {
  var n = 0;
  while (true) {
    var name = n === 0 ? 'Untitled.csv' : 'Untitled ' + n + '.csv';
    var path = joinVaultPath(folderPath, name);
    if (!vault.getAbstractFileByPath(path)) {
      return path;
    }
    n++;
  }
}

class UpdateBmcModal extends obsidian.Modal {
  constructor(app, version, onDismiss) {
    super(app);
    this.version = version;
    this.onDismiss = onDismiss;
  }

  onOpen() {
    var self = this;
    var content = this.contentEl;
    content.empty();
    content.addClass('table-csv-bmc-modal');

    content.createEl('h2', {
      text: t('TableCSV を更新しました', 'TableCSV updated', 'TableCSV aktualisiert'),
    });
    content.createEl('p', {
      text: t(
        'v' + this.version + ' へ更新されました。サポートお願いします。開発の励みになります。',
        'Updated to v' + this.version + '. If this plugin helps, consider a coffee (optional).',
        'Aktualisiert auf v' + this.version + '. Wenn dieses Plugin hilfreich ist, spendieren Sie gern einen Kaffee (optional).',
      ),
    });

    var actions = content.createDiv({ cls: 'table-csv-bmc-actions' });
    var coffeeBtn = actions.createEl('button', {
      cls: 'mod-cta',
      text: t('☕ Buy Me a Coffee', '☕ Buy Me a Coffee', '☕ Buy Me a Coffee'),
      type: 'button',
    });
    coffeeBtn.addEventListener('click', function () {
      window.open(BMC_URL, '_blank');
    });

    var closeBtn = actions.createEl('button', {
      text: t('閉じる', 'Close', 'Schließen'),
      type: 'button',
    });
    closeBtn.addEventListener('click', function () {
      self.close();
    });

    var hideRow = content.createDiv({ cls: 'table-csv-bmc-hide' });
    var hideLabel = hideRow.createEl('label');
    var hideCheck = hideLabel.createEl('input', { type: 'checkbox' });
    hideLabel.createSpan({
      text: t('更新後はこの案内を出さない', 'Do not show this after updates', 'Nach Updates nicht mehr anzeigen'),
    });
    hideCheck.addEventListener('change', function () {
      self.skipNext = hideCheck.checked;
    });
    this.skipNext = false;
  }

  onClose() {
    this.contentEl.empty();
    if (typeof this.onDismiss === 'function') {
      this.onDismiss(this.skipNext);
    }
  }
}

class TableCsvPlugin extends obsidian.Plugin {
  async onload() {
    var self = this;
    this.registerView(VIEW_TYPE, function (leaf) {
      return new TableCsvView(leaf);
    });
    try {
      if (this.app.viewRegistry && this.app.viewRegistry.unregisterExtensions) {
        this.app.viewRegistry.unregisterExtensions(['csv']);
      }
      this.registerExtensions(['csv'], VIEW_TYPE);
    } catch (e) {
      /* ignore */
    }

    this.addCommand({
      id: 'create-new-csv',
      name: t('CSVを新規作成', 'Create new CSV', 'Neue CSV erstellen'),
      callback: function () {
        self.createNewCsv();
      },
    });

    this.registerEvent(
      this.app.workspace.on('file-menu', function (menu, file) {
        if (file instanceof obsidian.TFolder) {
          menu.addItem(function (item) {
            item
              .setTitle(t('CSVを新規作成', 'New CSV', 'Neue CSV'))
              .setIcon('table')
              .onClick(function () {
                self.createNewCsv(file);
              });
          });
        }
      }),
    );

    this.app.workspace.onLayoutReady(function () {
      self.maybeShowBmcAfterUpdate();
    });
  }

  async createNewCsv(folder) {
    var vault = this.app.vault;
    var parent = folder instanceof obsidian.TFolder ? folder : null;
    if (!parent) {
      var active = this.app.workspace.getActiveFile();
      parent = active && active.parent ? active.parent : vault.getRoot();
    }
    var folderPath = parent.path === '/' ? '' : parent.path;
    var path = uniqueCsvPath(vault, folderPath);
    try {
      var file = await vault.create(path, '');
      var leaf = this.app.workspace.getLeaf(false);
      await leaf.openFile(file);
      if (leaf.view && typeof leaf.view.setMode === 'function') {
        leaf.view.setMode('edit');
      }
    } catch (e) {
      new obsidian.Notice(
        t('CSVを作成できませんでした', 'Could not create CSV', 'CSV konnte nicht erstellt werden'),
      );
    }
  }

  async maybeShowBmcAfterUpdate() {
    var current = this.manifest.version;
    var data = (await this.loadData()) || {};
    var prev = data.lastSeenVersion;

    if (prev === current) {
      return;
    }

    // prev が無いケースも含める（1.2.1 以前からの更新では lastSeenVersion が無い）
    if (!data.hideBmcAfterUpdate) {
      var self = this;
      new UpdateBmcModal(this.app, current, function (skipNext) {
        if (skipNext) {
          self.saveData(Object.assign({}, data, {
            lastSeenVersion: current,
            hideBmcAfterUpdate: true,
          }));
        }
      }).open();
    }

    await this.saveData(Object.assign({}, data, { lastSeenVersion: current }));
  }
}

module.exports = TableCsvPlugin;
