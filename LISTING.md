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
Open CSV as tables. Filter without changing the file. Select cells for sum, average, and count. Pin last row or first column. Copy, cut, paste. Paste entire table from the clipboard. Offline.
```

## Longer description (if available)

```
TableCSV opens .csv files as tables. Create a blank CSV from a folder. View filters and sorts without changing the file. A header filter row narrows one column (text, number or date range, checkbox) plus the search box; not written into the CSV. Select cells in View for sum, average, and count, with blanks listed. A pinned totals row is not counted twice. Right-click a header to set a column type. Pin the last row or first column. Drag a header edge to set width. Export filtered writes visible rows to a new CSV. Large tables draw visible rows. Edit saves to the same CSV. The filter stays on in Edit. Tab, Enter, and arrows move between cells. Undo and redo. Copy, cut, or clear a range. Paste fills from the selected cell. Paste entire table makes the file exactly the clipboard. HTML tables win when cell newlines break the plain text. Saving keeps delimiter, quoting, line endings, and UTF-8 BOM. German semicolon CSV stays intact.
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
