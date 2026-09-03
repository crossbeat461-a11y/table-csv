# Changelog

## 1.8.0

- View: pin the first column so it stays visible when scrolling sideways
- View: export the header plus currently visible (filtered/sorted) rows as a new CSV in the same folder; the original file is unchanged

### 日本語

- 閲覧: 先頭列を固定し、横スクロールしても左端の列を残す
- 閲覧: 見出しと、いま表示している行（絞り込み・並べ替え後）を同じフォルダの新しいCSVに書き出す。元のファイルは変わらない

### Deutsch

- Ansicht: Erste Spalte anheften, damit sie beim seitlichen Scrollen sichtbar bleibt
- Ansicht: Kopfzeile und derzeit sichtbare (gefilterte/sortierte) Zeilen als neue CSV im gleichen Ordner exportieren; die Originaldatei bleibt unverändert

## 1.7.0

- Edit: paste a copied range (Excel, Word, or TSV) into the selected cell with Ctrl+V / Cmd+V, right-click Paste, or the toolbar
- A 10×10 selection stays 10×10 and fills right and down from the selected cell; extra rows and columns are added as needed
- A single cell paste still goes into that cell only
- Word / browser tables use the HTML table on the clipboard when tab-separated text is missing

### 日本語

- 編集: Excel・Word・TSV の範囲を、選んだセルから `Ctrl+V` / `Cmd+V`、右クリックの貼り付け、またはツールバーで貼れる
- 10×10 の選択は 10×10 のまま、選んだセルから右下へ入る。足りない行・列は足す
- 1セルだけの貼り付けは、これまでどおりそのセルだけに入る
- タブ区切りが無いときは、クリップボードの HTML 表（Word / ブラウザ）を読む

### Deutsch

- Bearbeiten: Einen kopierten Bereich (Excel, Word oder TSV) in die gewählte Zelle einfügen — mit Strg+V / Cmd+V, Rechtsklick oder der Symbolleiste
- Eine 10×10-Auswahl bleibt 10×10 und füllt von der gewählten Zelle nach rechts unten; fehlende Zeilen und Spalten werden ergänzt
- Ein einzelner Zelleninhalt landet weiter nur in dieser Zelle
- Fehlt TSV, wird die HTML-Tabelle der Zwischenablage (Word / Browser) gelesen

## 1.6.1

- Japanese update support text: 「サポートお願いします。開発の励みになります。」

### 日本語

- 更新後の案内を「サポートお願いします。開発の励みになります。」に変更

### Deutsch

- Japanischer Hinweistext nach dem Update: 「サポートお願いします。開発の励みになります。」

## 1.6.0

- View and Edit: keep the table inside the pane and show horizontal and vertical scrollbars when the CSV is larger than the window
- Scrollbars stay visible even when the theme hides OS overlay bars

### 日本語

- 閲覧・編集: 表を画面内に収め、はみ出すときは縦横のスクロールバーを出す
- テーマが OS のオーバーレイバーを隠していても、バーが見えるようにする

### Deutsch

- Ansicht und Bearbeiten: Tabelle im Fenster halten; horizontale und vertikale Scrollleisten, wenn die CSV größer ist
- Scrollleisten bleiben sichtbar, auch wenn das Theme die Systemleisten ausblendet

## 1.5.0

- Create a new CSV from a folder (file explorer) or the command palette
- New files open in Edit so you can add cells, rows, and columns from a blank table

### 日本語

- フォルダの右クリック、またはコマンドパレットから CSV を新規作成
- 新規ファイルは編集モードで開き、空の表からセル・行・列を増やせる

### Deutsch

- Neue CSV aus einem Ordner (Dateiexplorer) oder über die Befehlspalette erstellen
- Neue Dateien öffnen im Bearbeiten-Modus, damit Zellen, Zeilen und Spalten von einer leeren Tabelle aus ergänzt werden können

## 1.4.4

- Keep the file's delimiter (comma, semicolon, or tab) when saving
- Keep quoting style (quote all fields vs quote only when needed)
- If nothing changed, Obsidian save also writes the original bytes (not a regenerated CSV)
- Column sort understands German-style numbers (`1,5` / `1.234,56`) when the OS or UI language is German
- UI follows the Obsidian language: Japanese, English, or German

### 日本語

- 保存時に元ファイルの区切り文字（カンマ / セミコロン / タブ）を維持
- 引用符の付け方（全フィールド引用 / 必要なときだけ）を維持
- 内容が変わっていなければ、Obsidian 側の保存でも元のバイト列を書き戻す
- OS または UI がドイツ語のとき、列の並べ替えでドイツ式の数値（`1,5` / `1.234,56`）を解釈
- UI は Obsidian の言語設定に従う（日本語・英語・ドイツ語）

### Deutsch

- Trennzeichen der Datei (Komma, Semikolon oder Tab) beim Speichern beibehalten
- Anführungszeichen-Stil beibehalten (alle Felder oder nur bei Bedarf)
- Unveränderte Dateien werden mit den Originalbytes gespeichert, nicht neu generiert
- Spaltensortierung versteht deutsche Zahlen (`1,5` / `1.234,56`), wenn OS oder UI auf Deutsch stehen
- Die Oberfläche folgt der Obsidian-Sprache: Japanisch, Englisch oder Deutsch

## 1.4.3

- Keep the file's original line endings (CRLF / LF / CR) when saving
- Keep whether the last line had a newline
- Keep a UTF-8 BOM when the file already had one
- Leave Edit without changing cells and the file is not rewritten

### 日本語

- 保存時に元ファイルの改行（CRLF / LF / CR）を維持
- 最終行の改行の有無を維持
- もともと UTF-8 BOM があるファイルは BOM を残す
- 編集モードに入ってセルを変えずに出ても、ファイルを書き直さない

## 1.4.2

- Keep IME composition in the filter box (Japanese, Chinese, Korean, and other input methods)
- Filter and column sort normalize Unicode so composed characters match
- Column sort uses the OS language, with Japanese / Chinese / Korean fallbacks

### 日本語

- フィルター入力中の IME 変換を維持（日本語・中国語・韓国語など）
- フィルターと列の並べ替えで Unicode 正規化を行い、合成文字でも一致するように
- 列の並べ替えは OS の言語を使い、日本語・中国語・韓国語もフォールバック

## 1.4.1

- Fix gap above the sticky column header when scrolling long tables
- Toolbar and file info stay fixed; only the table body scrolls

### 日本語

- 長い表をスクロールしたとき、列見出しの上に隙間が出る表示を修正
- ツールバーとファイル情報は固定のまま、表部分のみスクロール

## 1.4.0

- View mode: optional **Pin last row** checkbox keeps the bottom row (e.g. totals) out of column sort and always at the table foot
- Pinned last row uses a subtle highlight while the option is on

### 日本語

- 閲覧モードに **最下行を固定** チェックを追加。最後の1行（合計行など）を並べ替え対象外にし、常に表の下に表示
- 固定中の最下行は薄く強調表示

## 1.3.0

- View mode: click a column header to sort (asc → desc → clear). Filter and sort do not change the file

### 日本語

- 閲覧モードで列見出しをクリックして並べ替え（昇順 → 降順 → 解除）。フィルター・ソートはファイルを書き換えません

## 1.2.2

- Fix the post-update Buy Me a Coffee dialog so it also appears when upgrading from versions that had no version tracking yet
- Open the dialog after the workspace layout is ready

### 日本語

- バージョン記録が無かった版からの更新でも、Buy Me a Coffee の案内が出るように修正
- ワークスペース準備後にダイアログを開くように変更

## 1.2.1

- After an update, show an optional Buy Me a Coffee prompt once per release
- Add a setting to hide the post-update prompt
- Add a Buy Me a Coffee button in the CSV toolbar (next to Copy)

### 日本語

- アップデート後、リリースごとに1回だけ Buy Me a Coffee の案内を表示（任意）
- 更新後の案内を出さない設定を追加
- CSV を開いたときのツールバー（Copy の横）に Buy Me a Coffee ボタンを追加

## 1.2.0

- Copy the table to the OS clipboard (tab-separated, plus HTML for spreadsheet apps)
- Paste a table from Excel, Notepad, or TextEdit in Edit mode and save it as CSV
- View mode copies the header plus currently filtered rows
- Keyboard paste (`Ctrl+V` / `Cmd+V`) replaces the table when focus is not inside a cell

### 日本語

- 表をOSのクリップボードへコピー（タブ区切り。表計算ソフト向けにHTMLも付与）
- 編集モードで、Excel・メモ帳・TextEditから貼り付けてCSVとして保存
- 閲覧モードでは、見出し＋いま絞り込んでいる行だけをコピー
- セルにフォーカスしていないときの `Ctrl+V` / `Cmd+V` で表全体を置き換え
