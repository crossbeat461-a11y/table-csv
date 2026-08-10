'use strict';

var obsidian = require('obsidian');

var VIEW_TYPE = 'csv';

function parseCsv(text) {
  var raw = String(text || '').replace(/^\uFEFF/, '');
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
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter(function (r) {
    return r.some(function (v) {
      return String(v).trim() !== '';
    });
  });
}

class TableCsvView extends obsidian.TextFileView {
  constructor(leaf) {
    super(leaf);
    this.filter = '';
  }

  getViewType() {
    return VIEW_TYPE;
  }

  getDisplayText() {
    return this.file ? this.file.basename : 'CSV';
  }

  getViewData() {
    return this.data;
  }

  setViewData(data, _clear) {
    this.data = data;
    this.render();
  }

  clear() {
    this.data = '';
    this.contentEl.empty();
  }

  render() {
    var el = this.contentEl;
    el.empty();
    el.addClass('table-csv-view');

    var rows = parseCsv(this.data || '');
    var header = rows[0] || [];
    var q = String(this.filter || '').trim().toLowerCase();
    var body;
    if (!rows.length) {
      body = [];
    } else if (!q) {
      body = rows.slice(1);
    } else {
      body = rows.slice(1).filter(function (r) {
        return r.some(function (v) {
          return String(v).toLowerCase().includes(q);
        });
      });
    }

    var toolbar = el.createDiv({ cls: 'table-csv-toolbar' });
    var input = toolbar.createEl('input', {
      type: 'search',
      attr: { placeholder: 'Filter' },
    });
    input.value = this.filter || '';
    var self = this;
    input.addEventListener('input', function () {
      self.filter = input.value || '';
      self.render();
    });

    var total = Math.max(0, rows.length - 1);
    var path = this.file ? this.file.path : '(unsaved)';
    el.createDiv({
      cls: 'table-csv-meta',
      text: path + ' — ' + body.length + ' / ' + total,
    });

    if (!rows.length) {
      el.createEl('p', { text: 'Empty CSV' });
      return;
    }

    var table = el.createEl('table', { cls: 'table-csv-table' });
    var thead = table.createEl('thead');
    var hr = thead.createEl('tr');
    header.forEach(function (h) {
      hr.createEl('th', { text: String(h == null ? '' : h) });
    });
    var tbody = table.createEl('tbody');
    body.forEach(function (r) {
      var tr = tbody.createEl('tr');
      for (var i = 0; i < header.length; i++) {
        var val = String(r[i] == null ? '' : r[i]);
        tr.createEl('td', { text: val, attr: { title: val } });
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
