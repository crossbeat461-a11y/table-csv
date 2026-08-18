# Changelog

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
