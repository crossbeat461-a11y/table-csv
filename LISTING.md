# Listing copy (for community.obsidian.md → Edit listing)

Paste these values in the developer dashboard.

## Important (automated review)

- **`manifest.json` → `description` must NOT contain the word `Obsidian`.**
- **`authorUrl`** must be a GitHub **profile** URL, not the plugin repository.
- **GitHub Release title** must include the version (e.g. `TableCSV 1.1.0`). CI sets this on tag push.
- **Release assets** (`main.js`, `manifest.json`, `styles.css`) are published via GitHub Actions with **artifact attestations**.

## Short description

```
Open CSV files as tables. Create a new CSV from a folder, view with a filter, pin the last row or first column, edit cells, copy or paste, and export filtered rows.
```

## Longer description (if available)

```
TableCSV opens .csv files as tables inside your vault.
Create a new CSV from a folder (file explorer) or the command palette.
View mode filters rows without changing the file. You can pin the last row or the first column, and export the visible rows as a new CSV.
Edit mode updates cells, rows, and columns, then saves.
Copy puts the current table on the OS clipboard (tab-separated) so you can paste into Excel, Notepad, or TextEdit on Windows and Mac.
Paste (Edit mode) puts a copied Excel or Word range into the selected cell — a 10×10 stays 10×10. Fully offline — no network requests.
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
