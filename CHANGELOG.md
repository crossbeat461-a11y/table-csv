# Changelog

## 2.2.0

- Edit: **Paste entire table** makes the file exactly the clipboard table (toolbar, command palette). Works for new and overwrite. Undo restores the previous file
- Paste prefers a copied HTML table when the plain text is broken by newlines inside cells (browser dashboards). Cell text is not rewritten. German `1,5` stays as written
- View: pasting into the table (not the filter box) asks you to switch to Edit

### 日本語

- 編集: **表全体を貼り付け** で、クリップボードの表をファイルの中身そのままにする（新規・上書きどちらも。ツールバー、コマンドパレット）。元に戻すで直前の内容に戻る
- 貼り付けは、セル内改行でテキストが崩れているとき、ブラウザの表（HTML）を優先する。数値の表記は変えない。ドイツ式の `1,5` はそのまま
- 閲覧: 絞り込み欄以外へ貼ると、編集へ切り替えるよう知らせる

### Deutsch

- Bearbeiten: **Gesamte Tabelle einfügen** macht die Datei genau zur Tabelle aus der Zwischenablage (neu oder überschreiben; Leiste, Befehlspalette). Rückgängig stellt die vorherige Datei wieder her
- Beim Einfügen wird eine kopierte HTML-Tabelle bevorzugt, wenn der Klartext durch Zeilenumbrüche in Zellen zerfällt (Browser-Dashboards). Zelltext wird nicht umgeschrieben. Deutsches `1,5` bleibt unverändert
- Ansicht: Einfügen in die Tabelle (nicht ins Filterfeld) fordert den Wechsel in den Bearbeiten-Modus

## 2.1.1

- Filter and column filter update the visible rows only. Column widths are measured once, not on every keystroke

### 日本語

- 検索と列の絞り込みは、見えている行だけを描き直す。列幅は最初の1回だけ測る

### Deutsch

- Suche und Spaltenfilter zeichnen nur die sichtbaren Zeilen neu. Spaltenbreiten werden einmal gemessen, nicht bei jeder Taste

## 2.1.0

- View and Edit: a filter row under the header narrows that column only. Text matches a substring. Number and date use min and max (German `1,5` and `31.12.2026` stay as written). Checkbox is all / on / off / blank
- Column filters stay in the session and are not written into the CSV. They work with the existing search box (AND). Hidden rows stay untouched in Edit. Export filtered writes the rows you can see
- Changing a column type clears that column's filter. A toolbar button appears while any column filter is on

### 日本語

- 閲覧・編集: 見出しの下の欄で、その列だけを絞り込む。テキストは部分一致。数値と日付は以上・以下（ドイツ式の `1,5` や `31.12.2026` はそのまま）。チェックはすべて／オン／オフ／空
- 列の絞り込みは開いている間だけ覚え、CSV には書かない。上の検索欄と組み合わせる（両方に合う行）。編集では見えている行だけを直す。絞り込みを書き出すは、いま見えている行を出す
- 列の型を変えると、その列の絞り込みは消える。どれか1列でも絞っていると、ツールバーに「列の絞り込みを消す」が出る

### Deutsch

- Ansicht und Bearbeiten: Eine Filterzeile unter der Kopfzeile grenzt nur diese Spalte ein. Text sucht Teilzeichenketten. Zahl und Datum nutzen Min und Max (deutsches `1,5` und `31.12.2026` bleiben unverändert). Kontrollkästchen: alle / an / aus / leer
- Spaltenfilter gelten nur in der Sitzung und stehen nicht in der CSV. Sie wirken zusammen mit dem Suchfeld (UND). Im Bearbeiten bleiben ausgeblendete Zeilen unberührt. Filter exportieren schreibt die sichtbaren Zeilen
- Ein Wechsel des Spaltentyps löscht den Filter dieser Spalte. Solange ein Spaltenfilter aktiv ist, erscheint in der Leiste „Spaltenfilter löschen“

## 2.0.0

- View: click or drag to select cells. Shift+click extends the range. Ctrl+click (Cmd+click on Mac) adds a separate cell or range; drag or Shift+click from there to grow it. The totals cover all ranges, and a cell where ranges overlap counts once. The range is lightly highlighted. Escape clears it
- Status bar at the bottom of View. If every filled cell in the range is a number, it shows sum, average, and count. If the range is all text, it shows only the count. A mix of numbers and text shows nothing. Blank cells are counted and listed, e.g. "Count: 7 (blank: 1)". The average uses the number cells only
- The pinned last row is not part of the selection, so a totals row is never counted twice
- Copy and Ctrl+C / Cmd+C in View copy only the selected range when it has more than one cell. Separate ranges added with Ctrl+click are not copied; a notice asks for one range
- Desktop only. On mobile, View works as before

### 日本語

- 閲覧: セルをクリック・ドラッグで選べる。`Shift`+クリックで範囲を広げる。`Ctrl`+クリック（Mac は `Cmd`+クリック）で離れたセルや範囲を追加でき、そこからドラッグや `Shift`+クリックで広げられる。集計はすべての範囲を合わせて出し、範囲が重なったセルは1回だけ数える。選んだ範囲は薄く色が付く。`Esc` で解除
- 閲覧の最下部にステータスバー。範囲内の入力済みセルがすべて数値なら合計・平均・個数、すべて文字列なら個数だけを出す。数値と文字列が混ざると何も出さない。空白も個数に入れ、「個数: 7（うち空白 1）」のように内訳を出す。平均は数値のセルだけで出す
- 最終行固定の行は選べないので、合計行を二重に数えない
- 2 セル以上を選んでいるとき、閲覧のコピーと `Ctrl+C` / `Cmd+C` は選んだ範囲だけをコピーする。`Ctrl`+クリックで離れた範囲を足しているときはコピーせず、1つの範囲を選ぶよう知らせる
- デスクトップのみ。モバイルの閲覧はこれまでどおり

### Deutsch

- Ansicht: Zellen per Klick oder Ziehen auswählen. Umschalt+Klick erweitert den Bereich. Strg+Klick (Cmd+Klick auf dem Mac) fügt eine getrennte Zelle oder einen Bereich hinzu; von dort mit Ziehen oder Umschalt+Klick erweitern. Die Werte gelten für alle Bereiche, eine Zelle in überlappenden Bereichen zählt nur einmal. Der Bereich wird leicht hervorgehoben. Escape hebt ihn auf
- Statusleiste unten in der Ansicht. Sind alle gefüllten Zellen Zahlen, zeigt sie Summe, Mittelwert und Anzahl. Ist alles Text, nur die Anzahl. Bei Zahlen und Text gemischt zeigt sie nichts. Leere Zellen werden mitgezählt und ausgewiesen, z. B. „Anzahl: 7 (davon leer: 1)“. Der Mittelwert nutzt nur die Zahlenzellen
- Die fixierte letzte Zeile gehört nie zur Auswahl, eine Summenzeile wird also nicht doppelt gezählt
- Kopieren und Strg+C / Cmd+C kopieren in der Ansicht nur den gewählten Bereich, wenn er mehr als eine Zelle hat. Getrennte Bereiche (Strg+Klick) werden nicht kopiert; ein Hinweis bittet um einen Bereich
- Nur Desktop. Auf Mobilgeräten bleibt die Ansicht wie bisher

## 1.15.0

- Edit while filtered: the filter box now stays in Edit. Type to keep only the matching rows on screen and change them in place. Moving with Tab, Enter, and arrows skips the hidden rows. Copy, cut, and clear only touch the rows you can see. A multi-row paste is refused while filtered, so hidden rows are never overwritten

### 日本語

- 絞り込んだまま直せる: 編集モードにも絞り込み欄を置いた。入力すると一致する行だけが残り、そのまま直せる。`Tab`・`Enter`・矢印は隠れている行を飛ばして進む。コピー・切り取り・クリアは見えている行だけに効く。絞り込み中の複数行貼り付けは断り、隠れた行を書き換えない

### Deutsch

- Bearbeiten bei aktivem Filter: Das Filterfeld bleibt jetzt auch im Bearbeiten-Modus. Nur die passenden Zeilen bleiben sichtbar und lassen sich direkt ändern. Tab, Enter und Pfeile überspringen die ausgeblendeten Zeilen. Kopieren, Ausschneiden und Leeren betreffen nur sichtbare Zeilen. Ein Einfügen mehrerer Zeilen wird bei aktivem Filter abgelehnt, damit ausgeblendete Zeilen nicht überschrieben werden

## 1.14.0

- Edit: arrow keys move to the next cell when the caret is at the edge (or the whole cell is selected). Up and down always move. Shift+arrow extends a range. Escape clears the range

### 日本語

- 編集: 矢印は、カーソルが端にあるとき（またはセル全体を選んでいるとき）隣のセルへ進む。上下は常にセル移動。`Shift`+矢印で範囲。`Esc` で範囲を解除

### Deutsch

- Bearbeiten: Pfeiltasten wechseln die Zelle am Rand (oder wenn die ganze Zelle gewählt ist). Hoch/Runter immer. Umschalt+Pfeil erweitert die Auswahl. Escape hebt die Auswahl auf

## 1.13.1

- Keep header and body column widths the same. The two tables now share one measured width per column, so labels stay over their cells

### 日本語

- 見出しとデータの列幅を揃える。2つの表で列ごとに同じ幅を使い、見出しがセルの上に来るようにする

### Deutsch

- Spaltenbreiten von Kopf und Daten angleichen. Beide Tabellen nutzen dieselbe gemessene Breite, damit die Beschriftung über der Zelle bleibt

## 1.13.0

- View and Edit: right-click a column header to set its type (text, number, date, checkbox). Types are remembered per file and are not written into the CSV
- View: number and date columns sort by value; checkbox columns sort unchecked then checked
- Edit: a checkbox column shows a tick box and stores `TRUE` or `FALSE`

### 日本語

- 閲覧・編集: 列見出しを右クリックして型（テキスト、数値、日付、チェック）を指定する。ファイルごとに覚え、CSV には書かない
- 閲覧: 数値・日付の列は値で並べ替える。チェックの列はオフ、オンの順
- 編集: チェックの列はチェックボックスになり、`TRUE` / `FALSE` を保存する

### Deutsch

- Ansicht und Bearbeiten: Rechtsklick auf den Spaltenkopf setzt den Typ (Text, Zahl, Datum, Kontrollkästchen). Der Typ bleibt pro Datei und steht nicht in der CSV
- Ansicht: Zahlen- und Datumsspalten sortieren nach Wert; Kontrollkästchen sortieren von aus nach an
- Bearbeiten: eine Kontrollkästchen-Spalte zeigt ein Kästchen und speichert `TRUE` oder `FALSE`

## 1.12.1

- Fix vertical scrolling for large files: row height lives outside the table, so the scrollbar can move

### 日本語

- 大きいファイルの縦スクロールを修正。行の高さは表の外で確保し、スライダーが動くようにする

### Deutsch

- Vertikales Scrollen großer Dateien korrigiert: die Zeilenhöhe liegt außerhalb der Tabelle, damit die Leiste greift

## 1.12.0

- View and Edit: draw on-screen rows first. The rest wait until you scroll. Filter, sort, copy, and export still use the full table

### 日本語

- 閲覧・編集: 画面に見えている行から描く。残りはスクロールしたときに出る。絞り込み・並べ替え・コピー・書き出しは表全体を対象にする

### Deutsch

- Ansicht und Bearbeiten: Zuerst die sichtbaren Zeilen zeichnen. Der Rest folgt beim Scrollen. Filter, Sortierung, Kopieren und Export nutzen weiter die ganze Tabelle

## 1.11.1

- Shorten the plugin description so it stays within the 250-character review limit

### 日本語

- プラグイン説明を 250 文字以内に収める（審査対応）

### Deutsch

- Plugin-Beschreibung gekürzt, damit sie die 250-Zeichen-Grenze der Prüfung einhält

## 1.11.0

- Edit: cut a selected range (`Ctrl+X` / `Cmd+X`, toolbar, or command palette) — copies then clears the cells
- Edit: clear a selected range (`Delete` / `Backspace`, toolbar, or command palette). Rows and columns stay. Undo brings the values back

### 日本語

- 編集: 選んだ範囲を切り取る（`Ctrl+X` / `Cmd+X`、ツールバー、またはコマンドパレット）。コピーしたあと、セルを空にする
- 編集: 選んだ範囲をクリアする（`Delete` / `Backspace`、ツールバー、またはコマンドパレット）。行と列は残る。元に戻すで値が戻る

### Deutsch

- Bearbeiten: Auswahl ausschneiden (`Strg+X` / `Cmd+X`, Symbolleiste oder Befehlspalette) — kopiert und leert die Zellen
- Bearbeiten: Auswahl leeren (`Entf` / `Rücktaste`, Symbolleiste oder Befehlspalette). Zeilen und Spalten bleiben. Rückgängig stellt die Werte wieder her

## 1.10.1

- Edit: redo an undone change (`Ctrl+Y` / `Cmd+Shift+Z`, toolbar, or command palette)
- Edit: drag or Shift-click cells to select a range; Copy and `Ctrl+C` / `Cmd+C` copy that range. With no range, Copy still copies the whole table

### 日本語

- 編集: 取り消した変更をやり直す（`Ctrl+Y` / `Cmd+Shift+Z`、ツールバー、またはコマンドパレット）
- 編集: ドラッグまたは `Shift`+クリックで範囲を選ぶ。コピーと `Ctrl+C` / `Cmd+C` はその範囲。範囲が無いときは、これまでどおり表全体

### Deutsch

- Bearbeiten: Rückgängig gemachte Änderung wiederholen (`Strg+Y` / `Cmd+Umschalt+Z`, Symbolleiste oder Befehlspalette)
- Bearbeiten: Zellen ziehen oder mit Umschalt+Klick auswählen; Kopieren und `Strg+C` / `Cmd+C` kopieren die Auswahl. Ohne Auswahl wird weiter die ganze Tabelle kopiert

## 1.10.0

- Edit: Undo the last cell change, paste, or row/column insert or delete (`Ctrl+Z` / `Cmd+Z`, toolbar, or command palette)
- View and Edit: drag a column header edge to set the width; the width is remembered for that file

### 日本語

- 編集: 直前のセル変更・貼り付け・行／列の追加削除を取り消す（`Ctrl+Z` / `Cmd+Z`、ツールバー、またはコマンドパレット）
- 閲覧・編集: 列見出しの端をドラッグして幅を決める。そのファイルの幅を覚える

### Deutsch

- Bearbeiten: Letzte Zellenänderung, Einfügen oder Zeilen-/Spaltenänderung rückgängig (`Strg+Z` / `Cmd+Z`, Symbolleiste oder Befehlspalette)
- Ansicht und Bearbeiten: Spaltenbreite am Kopfzeilenrand ziehen; die Breite bleibt für diese Datei erhalten

## 1.9.1

- Detect semicolon CSV even when decimal commas (`1,5`) outnumber the semicolons
- New or empty CSV uses a semicolon when the UI or OS language is German
- German number sort (`1,5` / `1.234,56` / `1 234,56`) only when the UI or OS is actually German — not for Japanese or English

### 日本語

- 小数カンマ（`1,5`）がセミコロンより多くても、ドイツ式（`;` 区切り）として読む
- 新規・空の CSV は、UI または OS がドイツ語ならセミコロン区切り
- ドイツ式の数値並べ替え（`1,5` / `1.234,56` / `1 234,56`）は、UI または OS がドイツ語のときだけ。日本語・英語では使わない

### Deutsch

- Semikolon-CSV wird erkannt, auch wenn Dezimalkommas (`1,5`) häufiger sind als Semikolons
- Neue oder leere CSV nutzt Semikolon, wenn UI oder Betriebssystem auf Deutsch stehen
- Deutsche Zahlensortierung (`1,5` / `1.234,56` / `1 234,56`) nur bei deutscher UI oder OS — nicht bei Japanisch oder Englisch

## 1.9.0

- Edit: Tab / Shift+Tab move to the next or previous cell; Enter / Shift+Enter move down or up
- Tab at the end of a row wraps to the first cell of the next row
- IME composition (Japanese, Chinese, Korean, and other input methods) is left alone — confirming a conversion does not move to another cell

### 日本語

- 編集: `Tab` / `Shift+Tab` で左右のセルへ、`Enter` / `Shift+Enter` で上下のセルへ進む
- 行末の `Tab` は次の行の先頭に進む
- 変換中（日本語・中国語・韓国語など）は動かない。変換を確定しただけでは次のセルへ進まない

### Deutsch

- Bearbeiten: Tab / Umschalt+Tab zur nächsten oder vorherigen Zelle; Enter / Umschalt+Enter nach unten oder oben
- Tab am Zeilenende springt in die erste Zelle der nächsten Zeile
- IME-Eingabe (Japanisch, Chinesisch, Koreanisch u. a.) bleibt unberührt — das Bestätigen der Umwandlung wechselt nicht zur nächsten Zelle

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
