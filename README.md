# Iframe 高さ調整デモ - 親サイト

このプロジェクトは、iframe内の子サイトの高さが動的に変化した際に、親サイトのiframeが自動的に高さを調整するかどうかを検証するデモサイトです。

## 概要

親サイトと子サイトの2つのリポジトリで構成されています：
- **親サイト**（このリポジトリ）: 子サイトをiframeで埋め込む
- **子サイト**: [CHILD-iframe-event-communication-demo](https://github.com/kzk4043/CHILD-iframe-event-communication-demo) - iframe内に表示され、クリックで高さが変化する

## デモサイト

- **親サイト**: [https://kzk4043.github.io/PARENT-iframe-event-communication-demo/](https://kzk4043.github.io/PARENT-iframe-event-communication-demo/)
- **子サイト**: [https://kzk4043.github.io/CHILD-iframe-event-communication-demo/](https://kzk4043.github.io/CHILD-iframe-event-communication-demo/)

## 目的

このデモの主な目的は、以下の点を検証することです：

1. 子サイトのコンテンツの高さが動的に変化した際に、親サイトのiframeが自動的に高さを調整するか
2. 自動調整されない場合、スクロールバーが表示されるか、コンテンツが切り取られるか
3. 手動で高さを調整する必要があるか

## 使い方

1. 親サイトにアクセスします
2. iframe内の子サイトで「Click to Expand Content」ボタンをクリックします
3. 子サイトの高さが変化した際に、親サイトのiframeが自動的に高さを調整するか観察します
4. ブラウザのコンソールを開いて、デバッグログを確認できます

## ファイル構成

```
/
├── index.html          # 親サイトのHTML
├── styles.css          # 親サイトのスタイル
├── script.js           # 親サイトのJavaScript（iframe監視とpostMessage処理）
├── README.md           # このファイル
└── doc/
    └── spec.md         # 仕様書（英語）
```

## 機能

### 親サイトの機能

- **iframeの埋め込み**: 子サイトをiframeで表示
- **高さの監視**: ResizeObserverを使用してiframeの高さ変化を監視
- **postMessage対応**: 子サイトからの高さ変更通知を受信してiframeの高さを調整
- **リアルタイム表示**: iframeの現在の幅と高さを表示
- **デバッグログ**: コンソールに詳細なデバッグ情報を出力

### 子サイトとの通信

子サイトは`postMessage` APIを使用して親サイトに高さ変更を通知します。親サイトは以下のようにメッセージを受信します：

```javascript
window.addEventListener('message', function(event) {
    if (event.origin === 'https://kzk4043.github.io') {
        if (event.data.type === 'height-change') {
            const newHeight = event.data.height;
            iframe.style.height = newHeight + 'px';
        }
    }
});
```

## デバッグ

ブラウザの開発者ツールのコンソールを開くと、以下のようなデバッグログが表示されます：

- `[PARENT]` プレフィックス: 親サイトのログ
- スクリプトの読み込みタイミング
- iframeの読み込み状態
- 高さ変更の検出
- postMessageの送受信

## ローカル開発

1. リポジトリをクローンします：
   ```bash
   git clone https://github.com/kzk4043/PARENT-iframe-event-communication-demo.git
   cd PARENT-iframe-event-communication-demo
   ```

2. ローカルサーバーで起動します（例：Python）：
   ```bash
   python -m http.server 8000
   ```

3. ブラウザで `http://localhost:8000` にアクセスします

**注意**: 子サイトもローカルで起動する必要があります。子サイトのリポジトリもクローンして、別のポートで起動してください。

## GitHub Pagesへのデプロイ

1. リポジトリのSettings → Pagesに移動します
2. Source branchを`main`に設定します
3. Source folderを`/ (root)`に設定します
4. Saveをクリックします

デプロイ後、`https://kzk4043.github.io/PARENT-iframe-event-communication-demo/` でアクセスできます。

**重要**: 子サイトもGitHub Pagesにデプロイされている必要があります。

## 技術スタック

- HTML5
- CSS3
- JavaScript (ES6+)
- ResizeObserver API
- postMessage API

## ブラウザ対応

- Chrome/Edge (最新版)
- Firefox (最新版)
- Safari (最新版)

## ライセンス

このプロジェクトはデモ目的で作成されています。

## 関連リポジトリ

- [子サイトリポジトリ](https://github.com/kzk4043/CHILD-iframe-event-communication-demo)

## トラブルシューティング

### iframeが読み込まれない

- 子サイトがGitHub Pagesにデプロイされているか確認してください
- ブラウザのコンソールでエラーメッセージを確認してください
- ネットワークタブでiframeのリクエストが成功しているか確認してください

### 高さが自動調整されない

- ブラウザのコンソールで`[PARENT]`と`[CHILD]`のログを確認してください
- postMessageが正しく送信・受信されているか確認してください
- ResizeObserverがサポートされているか確認してください

### パフォーマンスの問題

- ブラウザのコンソールでデバッグログを確認してください
- 過剰な関数呼び出しがないか確認してください
- MutationObserverやsetIntervalの頻度を調整してください

## 貢献

バグ報告や機能要望は、Issueでお知らせください。

