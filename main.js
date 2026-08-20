'use strict';

var obsidian = require('obsidian');

var VIEW_TYPE = 'csv';

function parseDelimited(text, delim) {
  var raw = String(text || '').replace(/^\uFEFF/, '');
  if (!raw.length) {
    return [];
  }
  var rows = [];
  var row = [];
  var cell = '';
  var inQuotes = false;
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
    } else if (c === delim) {
      row.push(cell);
      cell = '';
    } else if (c === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (c !== '\r') {
      cell += c;
    }
  }
  if (cell.length || row.length || rows.length === 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function parseCsv(text) {
  return parseDelimited(text, ',');
}

function parseClipboardTable(text) {
  var raw = String(text || '').replace(/^\uFEFF/, '');
  if (!raw.length) {
    return [];
  }
  if (raw.indexOf('\t') !== -1) {
    return parseDelimited(raw, '\t');
  }
  return parseCsv(raw);
}

function needsQuote(s, delim) {
  var d = delim || ',';
  return s.indexOf('"') !== -1 || s.indexOf('\n') !== -1 || s.indexOf('\r') !== -1 || s.indexOf(d) !== -1;
}

function serializeDelimited(rows, delim) {
  var d = delim || ',';
  return rows
    .map(function (row) {
      return row
        .map(function (cell) {
          var s = String(cell == null ? '' : cell);
          if (needsQuote(s, d)) {
            return '"' + s.replace(/"/g, '""') + '"';
          }
          return s;
        })
        .join(d);
    })
    .join('\n');
}

function serializeCsv(rows) {
  return serializeDelimited(rows, ',');
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
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  var ok = document.execCommand('copy');
  document.body.removeChild(ta);
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
  var na = Number(sa.replace(/,/g, ''));
  var nb = Number(sb.replace(/,/g, ''));
  var aNum = sa !== '' && Number.isFinite(na) && /^-?\d+(\.\d+)?$/.test(sa.replace(/,/g, ''));
  var bNum = sb !== '' && Number.isFinite(nb) && /^-?\d+(\.\d+)?$/.test(sb.replace(/,/g, ''));
  if (aNum && bNum) {
    return na - nb;
  }
  return sa.localeCompare(sb, undefined, { numeric: true, sensitivity: 'base' });
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
  }

  async onOpen() {
    await super.onOpen();
    var self = this;
    this.registerDomEvent(this.contentEl, 'paste', function (ev) {
      if (self.mode !== 'edit') {
        return;
      }
      var t = ev.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) {
        return;
      }
      var text = ev.clipboardData ? ev.clipboardData.getData('text/plain') : '';
      if (!text) {
        return;
      }
      ev.preventDefault();
      self.applyPastedText(text);
    });
  }

  getViewType() {
    return VIEW_TYPE;
  }

  getDisplayText() {
    return this.file ? this.file.basename : 'CSV';
  }

  getViewData() {
    return serializeCsv(this.rows);
  }

  setViewData(data, clear) {
    this.data = data;
    this.rows = parseCsv(data);
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
    this.contentEl.empty();
  }

  persist() {
    this.data = serializeCsv(this.rows);
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
      new obsidian.Notice('Nothing to copy');
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
      new obsidian.Notice('Copied table');
    } catch (e) {
      try {
        fallbackCopyText(tsv);
        new obsidian.Notice('Copied table');
      } catch (e2) {
        new obsidian.Notice('Copy failed');
      }
    }
  }

  async pasteTable() {
    if (this.mode !== 'edit') {
      new obsidian.Notice('Switch to Edit to paste');
      return;
    }
    var text = '';
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        text = await navigator.clipboard.readText();
      }
    } catch (e) {
      new obsidian.Notice('Could not read clipboard');
      return;
    }
    this.applyPastedText(text);
  }

  applyPastedText(text) {
    var rows = parseClipboardTable(text);
    if (!rows.length) {
      new obsidian.Notice('Clipboard is empty');
      return;
    }
    this.rows = rows;
    this.selRow = 0;
    this.selCol = 0;
    this.persist();
    this.render();
    new obsidian.Notice('Pasted table');
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
    var q = String(this.filter || '').trim().toLowerCase();
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
          return String(v).toLowerCase().includes(q);
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

  render() {
    var el = this.contentEl;
    var self = this;
    el.empty();
    el.addClass('table-csv-view');
    el.toggleClass('is-edit', this.mode === 'edit');

    var toolbar = el.createDiv({ cls: 'table-csv-toolbar' });
    var viewBtn = toolbar.createEl('button', { text: 'View', type: 'button' });
    var editBtn = toolbar.createEl('button', { text: 'Edit', type: 'button' });
    viewBtn.toggleClass('mod-cta', this.mode === 'view');
    editBtn.toggleClass('mod-cta', this.mode === 'edit');
    viewBtn.addEventListener('click', function () {
      self.setMode('view');
    });
    editBtn.addEventListener('click', function () {
      self.setMode('edit');
    });

    var copyBtn = toolbar.createEl('button', { text: 'Copy', type: 'button' });
    copyBtn.addEventListener('click', function () {
      self.copyTable();
    });

    var bmcBtn = toolbar.createEl('button', {
      cls: 'table-csv-bmc-btn',
      text: t('☕ Buy Me a Coffee', '☕ Buy Me a Coffee'),
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
        text: t('最下行を固定', 'Pin last row'),
      });
      pinCheck.setAttribute(
        'title',
        t(
          '合計行など最後の1行を並べ替え対象外にし、常に表の下に表示します',
          'Keep the last row (e.g. totals) out of sort and always at the bottom',
        ),
      );
      pinCheck.addEventListener('change', function () {
        self.pinLastRow = pinCheck.checked;
        self.render();
      });

      var input = toolbar.createEl('input', {
        type: 'search',
        attr: { placeholder: 'Filter' },
      });
      input.value = this.filter || '';
      input.addEventListener('input', function () {
        self.filter = input.value || '';
        self.render();
      });
    } else {
      var pasteBtn = toolbar.createEl('button', { text: 'Paste', type: 'button' });
      pasteBtn.addEventListener('click', function () {
        self.pasteTable();
      });
      var insertRowBtn = toolbar.createEl('button', { text: 'Insert row', type: 'button' });
      var deleteRowBtn = toolbar.createEl('button', { text: 'Delete row', type: 'button' });
      var insertColBtn = toolbar.createEl('button', { text: 'Insert column', type: 'button' });
      var deleteColBtn = toolbar.createEl('button', { text: 'Delete column', type: 'button' });
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
    var path = this.file ? this.file.path : '(unsaved)';
    var modeLabel = this.mode === 'edit' ? 'edit' : 'view';
    el.createDiv({
      cls: 'table-csv-meta',
      text: path + ' — ' + modeLabel + ' — ' + shown + ' / ' + total,
    });

    if (!rows.length) {
      el.createEl('p', { text: this.mode === 'edit' ? 'Empty CSV. Insert a row to start.' : 'Empty CSV' });
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
              title: t('クリックで並べ替え', 'Click to sort'),
            },
          });
          thView.toggleClass('is-sorted', self.sortCol === colIndex);
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
          tr.createEl('td', { text: val, attr: { title: val } });
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

function isJapaneseLocale() {
  try {
    return String((window.localStorage && window.localStorage.getItem('language')) || '')
      .toLowerCase()
      .startsWith('ja');
  } catch (e) {
    return false;
  }
}

function t(ja, en) {
  return isJapaneseLocale() ? ja : en;
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
      text: t('TableCSV を更新しました', 'TableCSV updated'),
    });
    content.createEl('p', {
      text: t(
        'v' + this.version + ' へ更新されました。役に立ったら、開発の励みにしてください（任意）。',
        'Updated to v' + this.version + '. If this plugin helps, consider a coffee (optional).',
      ),
    });

    var actions = content.createDiv({ cls: 'table-csv-bmc-actions' });
    var coffeeBtn = actions.createEl('button', {
      cls: 'mod-cta',
      text: t('☕ Buy Me a Coffee', '☕ Buy Me a Coffee'),
      type: 'button',
    });
    coffeeBtn.addEventListener('click', function () {
      window.open(BMC_URL, '_blank');
    });

    var closeBtn = actions.createEl('button', {
      text: t('閉じる', 'Close'),
      type: 'button',
    });
    closeBtn.addEventListener('click', function () {
      self.close();
    });

    var hideRow = content.createDiv({ cls: 'table-csv-bmc-hide' });
    var hideLabel = hideRow.createEl('label');
    var hideCheck = hideLabel.createEl('input', { type: 'checkbox' });
    hideLabel.createSpan({
      text: t('更新後はこの案内を出さない', 'Do not show this after updates'),
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
    this.registerView(VIEW_TYPE, function (leaf) {
      return new TableCsvView(leaf);
    });
    try {
      if (this.app.viewRegistry && this.app.viewRegistry.unregisterExtensions) {
        this.app.viewRegistry.unregisterExtensions(['csv']);
      }
      this.registerExtensions(['csv'], VIEW_TYPE);
    } catch (e) {
      console.warn('table-csv: registerExtensions', e);
    }
    console.info('table-csv: loaded');
    var self = this;
    this.app.workspace.onLayoutReady(function () {
      self.maybeShowBmcAfterUpdate();
    });
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
