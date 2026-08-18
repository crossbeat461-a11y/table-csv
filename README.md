# TableCSV

[![GitHub release](https://img.shields.io/github/v/release/crossbeat461-a11y/table-csv?style=for-the-badge&display_name=tag)](https://github.com/crossbeat461-a11y/table-csv/releases/latest)
[![License: MIT](https://img.shields.io/github/license/crossbeat461-a11y/table-csv?style=for-the-badge)](https://github.com/crossbeat461-a11y/table-csv/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/crossbeat461-a11y/table-csv?style=for-the-badge)](https://github.com/crossbeat461-a11y/table-csv/stargazers)
[![GitHub downloads](https://img.shields.io/github/downloads/crossbeat461-a11y/table-csv/total?style=for-the-badge)](https://github.com/crossbeat461-a11y/table-csv/releases)
[![Obsidian downloads](https://img.shields.io/badge/dynamic/json?style=for-the-badge&logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22table-csv%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)](https://obsidian.md/plugins?id=table-csv)
[![Release](https://img.shields.io/github/actions/workflow/status/crossbeat461-a11y/table-csv/release.yml?style=for-the-badge&label=Release)](https://github.com/crossbeat461-a11y/table-csv/actions/workflows/release.yml)
![Obsidian](https://img.shields.io/badge/Obsidian-1.5.0%2B-483699?style=for-the-badge&logo=obsidian&logoColor=white)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/k_tech_studio)

Open `.csv` files as tables inside your vault. View and filter, or edit cells, rows, and columns.

![TableCSV screenshot](./images/screenshot.png)

## Features

- Open any CSV file as a clean table view
- Sticky header row for easier scrolling
- **View** mode: text filter to narrow rows (does not change the file)
- **Edit** mode: change cells, insert/delete rows and columns, then save to the vault
- **Copy** uses the OS clipboard (tab-separated). Paste into Excel, Notepad, or TextEdit
- **Paste** (Edit mode) reads a table from the clipboard — from Excel or a text editor — and writes it as CSV
- Empty rows and columns stay as you left them
- Works fully offline (no network requests)

## How to use

1. Install **TableCSV** from Community plugins and enable it
2. Open a `.csv` file from the file explorer
3. **View** is the default. Type in the filter box to narrow matching rows
4. Switch to **Edit** to change the file. The filter is cleared so you edit the whole table
5. Insert or delete the selected row/column with the toolbar. Click a cell to select it. Enter confirms a cell (does not move)
6. **Copy** puts the table on the system clipboard. In View mode this is the header plus filtered rows; in Edit mode it is the whole table
7. In **Edit**, **Paste** replaces the table with clipboard data (tab-separated from Excel, or comma-separated). `Ctrl+V` / `Cmd+V` does the same when focus is not inside a cell

## Tips

- Very large CSV files may take longer to render
- View mode never writes. Edit mode saves to the same `.csv` file in the vault
- Copy uses the system clipboard. It does not require a companion spreadsheet plugin

## Changelog

See [CHANGELOG.md](./CHANGELOG.md). Latest: **1.2.0** — copy and paste tables through the OS clipboard.

## Author

K-Tech Studio

## Support

[Buy Me a Coffee](https://buymeacoffee.com/k_tech_studio)

## License

MIT
