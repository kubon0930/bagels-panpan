# Bagels Panpan. 公式ホームページ

東京都板橋区・中板橋のベーグル専門店「Bagels Panpan.」の1ページ完結型公式サイトです。

- フレームワーク: [Next.js](https://nextjs.org)（App Router） + TypeScript
- スタイル: Tailwind CSS v4
- フォント: Quicksand（英字） / Noto Sans JP（日本語）

## 開発コマンド

```bash
npm install      # 初回のみ
npm run dev      # 開発サーバー起動 → http://localhost:3000
npm run build    # 本番ビルド
npm run lint     # ESLint
```

## 店舗情報・メニュー・FAQ の編集方法

サイトに表示される情報はすべて **`data/site.ts`** にまとまっています。
このファイルを編集して保存するだけで、サイト全体に反映されます。

| 定数 | 内容 |
| --- | --- |
| `siteUrl` | サイトのURL（独自ドメイン取得後に変更） |
| `shopInfo` | 店名・住所・アクセス・サービス・支払い方法・ブランドコピー |
| `businessHours` | 営業日・営業時間・定休日・注意書き |
| `weekDays` / `openWeekDays` | Access の営業日カレンダーチップ用 |
| `heroBadges` | Hero の英字情報バッジ |
| `menuItems` | メニューの商品名・説明文・タグ・焼き色トーン・写真パス |
| `conceptScenes` | Concept の「朝ごはん・ランチ・手土産」ミニカード |
| `faqItems` | FAQ の質問と回答 |
| `socialLinks` | Instagram・食べログの URL |
| `googleMapsUrl` | 「Google Mapで見る」リンク（住所から自動生成） |
| `instagramCards` | Instagram セクションの仮カード文言 |

営業日や商品内容は変わる可能性があるため、サイト内には「最新情報はInstagramをご確認ください」という導線を各所に入れています。文言を変える場合も `data/site.ts` の `instagramNote` などを編集してください。

`TODO:` コメントが付いている箇所は、情報確定後に差し替えが必要な場所です。エディタで「TODO」を検索すると一覧できます。

## 写真の差し替え方法

写真は **`public/images/`** に置きます。

1. **Hero（トップの大きなビジュアル）**
   `components/Hero.tsx` の TODO コメントの位置で、`BagelGraphic`（仮の円形グラフィック）を `next/image` の `<Image src="/images/hero.jpg" ... />` に差し替えます。
2. **メニューの商品写真**
   `public/images/plain.jpg` のように写真を置き、`data/site.ts` の各商品の `image` に `"/images/plain.jpg"` を設定します。設定した商品だけ写真表示に切り替わります（未設定の商品は仮グラフィックのまま）。
3. **OGP 画像（SNS シェア時の画像）**
   `public/images/og-image.png`（1200×630px）を実際の写真入り画像に上書きします。
4. **favicon**
   `app/icon.svg` を差し替えます（SVG のほか `app/icon.png` でも可）。

## Google Map

`components/GoogleMap.tsx` が店名・住所・座標（`data/site.ts` の `shopLatLng`）をもとに Google Map を埋め込んでいます。
「Google Mapで見る」ボタンのリンク先は `data/site.ts` の `googleMapsUrl`（実店舗のプレイスURL）です。
移転などで場所が変わった場合は、この2つの定数を更新してください。

## SEO / OGP / 構造化データ

`app/layout.tsx` の `metadata` で title / description / OGP を設定しています。
`app/page.tsx` には LocalBusiness（Bakery）の JSON-LD 構造化データを埋め込んでいます。
独自ドメインを取得したら `data/site.ts` の `siteUrl` を変更してください（metadata と JSON-LD の両方に反映されます）。

## カラーパレット

`app/globals.css` の `@theme` で定義しています（`bg-cream` `text-cocoa` などのクラスで使用）。

- `cream #FFF8EF` ベース背景 / `soft #FFFCF7` カード背景
- `crust #B9855A` メインの焼き色 / `toast #E8A15A` アクセント
- `wheat #F3E1C8` サブ / `milk #FFF1DD` セクション背景
- `cocoa #3A2A1F` テキスト / `espresso #2B1C14` フッター

## Vercel へのデプロイ

1. このリポジトリを GitHub にプッシュ
2. [Vercel](https://vercel.com) で「New Project」→ リポジトリを選択
3. 設定はデフォルトのまま「Deploy」（Next.js が自動認識されます）

以降は `main` ブランチにプッシュするたびに自動でデプロイされます。

## ディレクトリ構成

```
app/            レイアウト・トップページ・グローバルCSS・favicon
components/     セクションごとのコンポーネント（Header, Hero, Menu など）
data/site.ts    店舗情報・営業情報・メニュー・FAQ・SNSリンク（編集はここ）
public/images/  写真置き場（差し替え用）
```
