# Listing copy (for community.obsidian.md → Edit listing)

Paste these values in the developer dashboard.

## Important (automated review)

- **`manifest.json` → `description` must NOT contain the word `Obsidian`.**
- **`authorUrl`** must be a GitHub **profile** URL, not the plugin repository.
- **GitHub Release title** must include the version (e.g. `TableCSV 1.1.0`). CI sets this on tag push.
- **Release assets** (`main.js`, `manifest.json`, `styles.css`) are published via GitHub Actions with **artifact attestations**.

## Short description

```
Open CSV files as tables. View with a text filter, edit cells, and copy or paste via the system clipboard.
```

## Longer description (if available)

```
TableCSV opens .csv files as tables inside your vault.
View mode filters rows without changing the file.
Edit mode updates cells, rows, and columns, then saves.
Copy puts the current table on the OS clipboard (tab-separated) so you can paste into Excel, Notepad, or TextEdit on Windows and Mac.
Paste (Edit mode) reads a table from the clipboard and saves it as CSV. Fully offline — no network requests.
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
