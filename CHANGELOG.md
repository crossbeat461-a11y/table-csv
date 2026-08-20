# Changelog

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
