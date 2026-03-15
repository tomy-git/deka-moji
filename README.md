# Dekamoji

Unicode 文字を PC・スマートフォン・タブレットで大きく表示する、フロントエンド専用の静的 Web アプリです。入力した文字を即時プレビューし、履歴再利用、テーマ切替、フォント切替、PDF 出力をブラウザだけで完結させます。

## セットアップ

```bash
npm install
```

## 開発

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

## Docker

```bash
docker compose up --build
```

Docker では bind mount 上の変更を確実に検知するため、Vite のポーリング監視を有効にしています。コード変更後はコンテナ内で自動的にホットリロードされます。
依存関係が更新された場合でも起動時に `npm install` を実行するため、`node_modules` ボリュームに古い依存が残っていても追従します。

## 検証

```bash
npm run typecheck
npm test
npm run build
```

## 現在の実装方針

- 改行はスペースへ正規化し、単一行中心で表示
- 長文は自動縮小し、閾値超過時は警告を表示
- テーマ初期値は OS 設定に追従
- 履歴には文字列、文字色、テーマ、フォント、保存日時を保持
- PDF 出力は印刷 CSS と `window.print()` を利用
