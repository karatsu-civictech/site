# シビックテック唐津 公式サイト（ハブ）

佐賀県唐津市のシビックテック団体「シビックテック唐津」の公式サイトです。
このリポジトリは **ハブサイト**で、団体紹介と、各 Web アプリ（データツール）への
入口の役割を持ちます。

🌐 **公開URL: https://civictech-karatsu.org/**

- GitHub Organization: https://github.com/karatsu-civictech
- 使用技術: [Astro](https://astro.build/)（静的サイト）
- ホスティング: [Cloudflare Pages](https://pages.cloudflare.com/)（独自ドメイン `civictech-karatsu.org` 割当・SSL有効）
- デプロイ: `main` への push で GitHub Actions が自動ビルド & 公開（`.github/workflows/deploy.yml`）

## 全体アーキテクチャ（パス方式マルチゾーン）

各アプリは **独立したリポジトリ** で開発し、ハブが `vercel.json` の `rewrites` で
パスごとに転送します。利用者からは 1 つのドメインに見えます。

```
civictech-karatsu.org            ← このリポジトリ（ハブ / site）
        │  vercel.json の rewrites で転送
        ├─ /gikai/*   → gikai-mindmap  プロジェクト（別リポジトリ）
        └─ /bousai/*  → bousai-map     プロジェクト（別リポジトリ）
```

- アプリごとにリポジトリ・フレームワーク・デプロイが独立（別の人が別のアプリを作れる）
- URL は `civictech-karatsu.org/<path>` に統一

## 新しいアプリを追加する手順

1. **トップに載せる**: `src/data/apps.ts` の `apps` 配列に 1 件追記する。
   ```ts
   {
     path: 'gikai',              // civictech-karatsu.org/gikai
     title: '市議会 発言マインドマップ',
     description: '…',
     status: 'live',             // 'live' | 'wip' | 'planned'
     repo: 'gikai-mindmap',
     icon: '🗳️',
   }
   ```
2. **アプリ本体を作る**: `karatsu-civictech/<repo>` を新規作成して開発。
   そのアプリの base path を `/<path>`（例 `/gikai`）に設定する。
   - Astro: `astro.config.mjs` に `base: '/gikai'`
   - Next.js: `next.config.js` に `basePath: '/gikai'`
3. **ハブから転送する**: このリポジトリの `vercel.json` の `rewrites` に追記。
   ```json
   {
     "rewrites": [
       { "source": "/gikai/:path*", "destination": "https://gikai-mindmap.vercel.app/gikai/:path*" }
     ]
   }
   ```
4. `status` を `live` にすると、トップのカードが「開く →」リンクになります。

## 🧞 コマンド

| Command        | Action                                |
| :------------- | :------------------------------------ |
| `pnpm install` | 依存をインストール                    |
| `pnpm dev`     | 開発サーバ起動（`localhost:4321`）    |
| `pnpm build`   | `./dist/` に本番ビルド                |
| `pnpm preview` | ビルド結果をローカルで確認            |

## ディレクトリ構成

```
src/
├── data/
│   └── apps.ts          ← アプリ一覧（ここを編集してアプリを増やす）
├── layouts/
│   └── Layout.astro     ← 共通ヘッダー・フッター・全体スタイル
└── pages/
    └── index.astro      ← トップページ
public/
└── favicon.svg
vercel.json              ← 各アプリへの rewrites
```
