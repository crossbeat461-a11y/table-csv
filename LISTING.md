# Listing copy (for community.obsidian.md → Edit listing)

Paste these values in the developer dashboard.

## Important (automated review)

- **`manifest.json` → `description` must NOT contain the word `Obsidian`.** Keep it at **250 characters or fewer**.
- **Edit listing** — Short description **200 characters or fewer**. Longer description **1000 characters or fewer** (spaces count). These limits are separate from the 250-character manifest cap.
- **`authorUrl`** must be a GitHub **profile** URL, not the plugin repository.
- **GitHub Release title** must include the version (e.g. `TableCSV 1.1.0`). CI sets this on tag push.
- **Release assets** (`main.js`, `manifest.json`, `styles.css`) are published via GitHub Actions with **artifact attestations**.

## Short description

```
Open CSV as tables. Create a CSV from a folder. Filter and sort without changing the file. Pin last row or first column. Copy, cut, or clear a range. Paste from Excel. Export filtered rows. Offline.
```

## Longer description (if available)

```
TableCSV opens .csv files as tables in your vault. Create a blank CSV from a folder or the command palette. New files open in Edit. Existing files start in View. View filters and sorts rows without changing the file. Pin the last row for totals. Pin the first column when the table is wide. Drag a header edge to set column width; the file remembers it. Export filtered writes the header plus visible rows to a new CSV nearby. The original file stays. Edit changes cells, rows, and columns, then saves to the same CSV. Tab and Enter move between cells. IME composition is left alone. Undo and redo the last edit. Drag or Shift-click a range, then copy, cut, or clear it. Clear empties cells; rows and columns stay. Copy uses the OS clipboard for Excel, Notepad, or TextEdit. Cut copies then clears. Paste fills from the selected cell. 10x10 stays 10x10. Saving keeps delimiter, quoting, line endings, and UTF-8 BOM. German semicolon CSV stays intact. Fully offline. Free, MIT. Author: K-Tech Studio.
```

## Suggested categories / tags

- Data
- Tables
- Files
- Utility

## Screenshot to upload

Upload this file on Edit listing → Screenshots:

`images/screenshot.png` in the GitHub repo
(or Desktop: table-csv-repo\images\screenshot.png)
