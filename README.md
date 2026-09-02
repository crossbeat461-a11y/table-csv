# TableCSV

[![GitHub release](https://img.shields.io/github/v/release/crossbeat461-a11y/table-csv?style=for-the-badge&display_name=tag)](https://github.com/crossbeat461-a11y/table-csv/releases/latest)
[![License: MIT](https://img.shields.io/github/license/crossbeat461-a11y/table-csv?style=for-the-badge)](https://github.com/crossbeat461-a11y/table-csv/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/crossbeat461-a11y/table-csv?style=for-the-badge)](https://github.com/crossbeat461-a11y/table-csv/stargazers)
[![GitHub downloads](https://img.shields.io/github/downloads/crossbeat461-a11y/table-csv/total?style=for-the-badge)](https://github.com/crossbeat461-a11y/table-csv/releases)
[![Obsidian downloads](https://img.shields.io/badge/dynamic/json?style=for-the-badge&logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22table-csv%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)](https://obsidian.md/plugins?id=table-csv)
[![Release](https://img.shields.io/github/actions/workflow/status/crossbeat461-a11y/table-csv/release.yml?style=for-the-badge&label=Release)](https://github.com/crossbeat461-a11y/table-csv/actions/workflows/release.yml)
![Obsidian](https://img.shields.io/badge/Obsidian-1.8.7%2B-483699?style=for-the-badge&logo=obsidian&logoColor=white)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/k_tech_studio)

**[English](#readme-en)** · **[日本語](#readme-ja)** · **[Deutsch](#readme-de)**

![TableCSV screenshot](./images/screenshot.png)

---

<a id="readme-en"></a>

## English

Open `.csv` files as tables inside your vault. View and filter, or edit cells, rows, and columns. Create a new CSV from a folder.

### Features

- Open any CSV file as a clean table view
- **Create** a new CSV from a folder (right-click) or the command palette; it opens in Edit
- Sticky header row for easier scrolling
- **View** mode: text filter to narrow rows (does not change the file)
- **View** mode: click a column header to sort (asc → desc → clear; does not change the file)
- **View** mode: optional **Pin last row** for CSVs with a totals row at the bottom (keeps that row out of sort)
- **Edit** mode: change cells, insert/delete rows and columns, then save to the vault
- **Copy** uses the OS clipboard (tab-separated). Paste into Excel, Notepad, or TextEdit
- **Paste** (Edit mode): copy a range in Excel (or Word / a text table) and paste with `Ctrl+V` / `Cmd+V`, right-click Paste, or the toolbar. A 10×10 stays 10×10, starting at the selected cell
- Empty rows and columns stay as you left them
- Saving keeps the file's delimiter, quoting style, line endings, and UTF-8 BOM
- UI follows the Obsidian language (Japanese, English, or German)
- Works fully offline (no network requests)

### How to use

1. Install **TableCSV** from Community plugins and enable it
2. Right-click a folder and choose **New CSV**, or run the same from the command palette. You can also open an existing `.csv`
3. A new file opens in **Edit**. Existing files start in **View**. Type in the filter box to narrow matching rows. Click a column header to sort. Check **Pin last row** when the bottom row is a total you do not want moved
4. Switch to **Edit** to change an existing file. The filter and sort are cleared so you edit the whole table
5. Insert or delete the selected row/column with the toolbar. Click a cell to select it. Enter confirms a cell (does not move)
6. **Copy** puts the table on the system clipboard. In View mode this is the header plus filtered rows; in Edit mode it is the whole table
7. In **Edit**, select a cell and paste (`Ctrl+V` / `Cmd+V`, right-click Paste, or the toolbar **Paste** button). Excel, Word, and tab-separated text fill right and down from that cell. Extra rows and columns are added if the range is larger. A single copied cell still pastes into the selected cell only

### Tips

- Very large CSV files may take longer to render
- View mode never writes. Edit mode saves to the same `.csv` file in the vault
- Copy and paste use the system clipboard. They do not require a companion spreadsheet plugin
- Paste does not open `.xlsx` or `.docx` files. Copy the cells in Excel or Word first, then paste into TableCSV

### Changelog

See [CHANGELOG.md](./CHANGELOG.md). Latest: **1.7.0** — Excel-style range paste into the selected cell.

### Author

K-Tech Studio

### Support

[Buy Me a Coffee](https://buymeacoffee.com/k_tech_studio)

### Disclaimer (no warranty)

This software is provided **as is**, without warranty of any kind. The developer does not guarantee that it will work in every environment. Use at your own risk. See the [MIT License](LICENSE).

### License

MIT

---

<a id="readme-ja"></a>

<details open>
<summary><strong>日本語</strong>（クリックで開閉）</summary>

Vault内の `.csv` を表として開きます。閲覧と絞り込み、セル・行・列の編集ができます。フォルダから CSV を新規作成できます。

### 機能

- CSVファイルを表形式で表示
- **新規作成**: フォルダの右クリック、またはコマンドパレット。編集モードで開く
- 見出し行を固定してスクロールしやすい
- **View（閲覧）**: 文字で行を絞り込む（ファイルは変更しない）
- **View（閲覧）**: 列見出しをクリックして並べ替え（昇順 → 降順 → 解除。ファイルは変更しない）
- **View（閲覧）**: **最下行を固定** — 合計行など最後の1行を並べ替え対象外にできる
- **Edit（編集）**: セルの変更、行・列の追加・削除。Vault内の同じCSVに保存する
- **Copy（コピー）**: OSのクリップボードへ（タブ区切り）。Excel、メモ帳、TextEditに貼り付けできる
- **Paste（貼り付け）**（編集モード）: Excel（または Word / テキストの表）で範囲をコピーし、`Ctrl+V` / `Cmd+V`、右クリックの貼り付け、またはツールバーで貼る。10×10 は 10×10 のまま、選んだセルから入る
- 空の行・列はそのまま残る
- 保存時に区切り文字・引用符の付け方・改行・UTF-8 BOM を維持
- UI は Obsidian の言語設定に従う（日本語・英語・ドイツ語）
- 完全オフライン（通信しない）

### 使い方

1. コミュニティプラグインから **TableCSV** を入れて有効にする
2. ファイル一覧のフォルダを右クリックして **CSVを新規作成**、またはコマンドパレットで同じ操作。既存の `.csv` を開いてもよい
3. 新規ファイルは **Edit**。既存ファイルは最初 **View**。フィルター欄に文字を入れると行が絞り込まれる。列見出しをクリックすると並べ替え。**最下行を固定** にチェックすると、合計行など最後の1行は並べ替えされず下に残る
4. 既存ファイルを直すときは **Edit** に切り替える。フィルターとソートは解除され、表全体を編集する
5. ツールバーで選択中の行・列を追加・削除する。セルをクリックして選ぶ。Enterは確定のみ（移動しない）
6. **Copy** で表をクリップボードへ送る。Viewでは見出し＋絞り込み後の行、Editでは表全体
7. **Edit** でセルを選んで貼る（`Ctrl+V` / `Cmd+V`、右クリックの貼り付け、またはツールバーの **貼り付け**）。Excel・Word・タブ区切りは、そのセルから右下へ入る。範囲が大きければ行・列を足す。1セルだけのコピーは、そのセルだけに入る

### ヒント

- とても大きいCSVは表示に時間がかかることがある
- Viewは書き込まない。EditはVault内の同じ `.csv` に保存する
- コピーと貼り付けはOSのクリップボードを使う。別の表計算プラグインは不要
- `.xlsx` や `.docx` はそのまま開けない。Excel や Word でセルをコピーしてから TableCSV に貼る

### 更新履歴

[CHANGELOG.md](./CHANGELOG.md) を参照。最新は **1.7.0** — 選んだセルから Excel と同じ範囲貼り付け。

### 作者

K-Tech Studio

### サポート

[Buy Me a Coffee](https://buymeacoffee.com/k_tech_studio)

### 免責（無保証）

本ソフトウェアは **現状有姿（無保証）** で提供します。あらゆる環境での動作を保証しません。利用は自己責任です。詳細は [MIT ライセンス](LICENSE) を参照してください。

### ライセンス

MIT

</details>

---

<a id="readme-de"></a>

<details>
<summary><strong>Deutsch</strong> (aufklappen)</summary>

Öffnet `.csv`-Dateien als Tabellen im Vault. Anzeigen und filtern, oder Zellen, Zeilen und Spalten bearbeiten. Neue CSV aus einem Ordner erstellen.

Die Oberfläche folgt der Obsidian-Sprache (Japanisch, Englisch, Deutsch).

### Funktionen

- CSV-Dateien als Tabelle anzeigen
- **Neu**: CSV aus einem Ordner oder über die Befehlspalette erstellen (öffnet im Bearbeiten-Modus)
- Kopfzeile bleibt beim Scrollen sichtbar
- **Ansicht**: Zeilen filtern und Spalten sortieren (Datei bleibt unverändert)
- **Ansicht**: optional **Letzte Zeile anheften** für Summenzeilen
- **Bearbeiten**: Zellen, Zeilen und Spalten ändern und in die gleiche Datei speichern
- Speichern behält Trennzeichen, Anführungszeichen-Stil, Zeilenenden und UTF-8-BOM
- **Kopieren** / **Einfügen** über die Systemzwischenablage
- **Einfügen** (Bearbeiten): Bereich in Excel kopieren, Zelle wählen, Strg+V / Cmd+V, Rechtsklick oder Symbolleiste. 10×10 bleibt 10×10, ab der gewählten Zelle
- Vollständig offline

### Versionshinweise

Siehe [CHANGELOG.md](./CHANGELOG.md). Aktuell: **1.7.0** — Bereich einfügen wie in Excel.

### Lizenz

MIT

</details>

