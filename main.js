'use strict';

var obsidian = require('obsidian');

var VIEW_TYPE = 'csv';

function parseCsv(text) {
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
    } else if (c === ',') {
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

function needsQuote(s) {
  return /[",\n\r]/.test(s);
}

function serializeCsv(rows) {
  return rows
    .map(function (row) {
      return row
        .map(function (cell) {
          var s = String(cell == null ? '' : cell);
          if (needsQuote(s)) {
            return '"' + s.replace(/"/g, '""') + '"';
          }
          return s;
        })
        .join(',');
    })
    .join('\n');
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

  setMode(mode) {
    if (mode === this.mode) {
      return;
    }
    if (mode === 'edit') {
      this.filter = '';
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
    if (!q) {
      return body.map(function (r, i) {
        return { row: r, index: i + 1 };
      });
    }
    var out = [];
    for (var i = 0; i < body.length; i++) {
      var r = body[i];
      var hit = r.some(function (v) {
        return String(v).toLowerCase().includes(q);
      });
      if (hit) {
        out.push({ row: r, index: i + 1 });
      }
    }
    return out;
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

    if (this.mode === 'view') {
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

    var table = el.createEl('table', { cls: 'table-csv-table' });
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
        hr.createEl('th', { text: headVal });
      }
    }

    var tbody = table.createEl('tbody');
    if (this.mode === 'edit') {
      for (var r = 1; r < rows.length; r++) {
        this.renderEditRow(tbody, r, cols);
      }
    } else {
      body.forEach(function (item) {
        var tr = tbody.createEl('tr');
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
  }
}

module.exports = TableCsvPlugin;
