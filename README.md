# Bagels Panpan. 公式ホームページ

東京都板橋区・中板橋のベーグル専門店「Bagels Panpan.」の1ページ完結型公式サイトです。
実店舗（ネイビーの看板・白文字ロゴ・丸いロゴマーク）に合わせたネイビー基調のデザイン。

- フレームワーク: [Next.js](https://nextjs.org)（App Router） + TypeScript
- スタイル: Tailwind CSS v4
- フォント: Quicksand（英字） / Noto Sans JP（日本語）

## 営業情報（2026年7月時点）

- 営業日：水・金・土
- 営業時間：12:00〜売り切れまで
- 定休日：月・火・木・日・祝日
- 注意：オープン時間は変更になる可能性があります。最新情報は随時Instagramにてお知らせします。

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
| `brandImages` | ロゴ・店舗外観・OGP画像のパス |
| `businessHours` | 営業日・営業時間・定休日・注意書き |
| `weekDays` / `openWeekDays` | Access の営業日カレンダーチップ用 |
| `heroBadges` | Hero の英字情報バッジ |
| `menuItems` | メニューの商品名・説明文・タグ・焼き色トーン・写真パス |
| `conceptScenes` | Concept の「朝ごはん・ランチ・手土産」ミニカード |
| `faqItems` | FAQ の質問と回答 |
| `socialLinks` | Instagram・食べログの URL |
| `googleMapsUrl` / `shopLatLng` | Google Map のプレイスURLと座標 |
| `instagramCards` | Instagram セクションの発信内容リスト |

営業日やオープン時間は変わる可能性があるため、サイト内には「最新情報はInstagramをご確認ください」という導線を各所に入れています。

`TODO:` コメントが付いている箇所は、情報確定後に差し替えが必要な場所です。エディタで「TODO」を検索すると一覧できます。

## 画像の差し替え方法

画像は **`public/images/`** に置きます。ブランド画像は以下の3つです。

| ファイル | 用途 | 現状 |
| --- | --- | --- |
| `panpan-logo-circle.jpg` | 丸いネイビーロゴ（Header・Footer・Instagramカード等） | 生成した仮ロゴ入り。実際のInstagramアイコン画像に上書き可 |
| `panpan-storefront.jpg` | 店舗外観写真（Hero・Access） | **未配置**。置いて再ビルドすると自動で写真表示に切り替わります |
| `ogp-placeholder.jpg` | OGP画像（SNSシェア用 1200×630px） | 生成した仮画像入り。実写真入りに上書き可 |

その他:

1. **メニューの商品写真** — `public/images/plain.jpg` のように置き、`data/site.ts` の各商品の `image` に `"/images/plain.jpg"` を設定
2. **favicon** — `app/icon.svg` を差し替え（ネイビーの丸ロゴ）

写真を追加・上書きしたら、GitHubへ push すると Vercel が自動で再ビルドして反映します。

## Google Map

`components/GoogleMap.tsx` が店名・住所・座標（`data/site.ts` の `shopLatLng`）をもとに Google Map を埋め込んでいます。
「Google Mapで見る」ボタンのリンク先は `data/site.ts` の `googleMapsUrl`（実店舗のプレイスURL）です。
移転などで場所が変わった場合は、この2つの定数を更新してください。

## SEO / OGP / 構造化データ

`app/layout.tsx` の `metadata` で title / description / OGP を設定しています。
`app/page.tsx` には LocalBusiness（Bakery）の JSON-LD 構造化データを埋め込んでいます（閉店時刻は「売り切れ次第」のため記載していません）。
独自ドメインを取得したら `data/site.ts` の `siteUrl` を変更してください。

## カラーパレット

`app/globals.css` の `@theme` で定義しています（`bg-navy` `text-ink` などのクラスで使用）。

- `navy #102050` メイン / `navy-deep #081A3D` Hero・Footer / `navy-soft #33446C` / `navy-storefront #25385F`
- `paper #F7F3EC` ロゴの白 / `warm #FFFDF8` ベース背景 / `cream #F6F0E7` セクション背景
- `bagel #B97945` 焼き色 / `toast #D3914A` 明るい焼き色（アクセント）
- `ink #1E2430` 本文 / `muted #7A7D86` 補足 / `line #E7E0D6` 罫線

## Vercel へのデプロイ

GitHub リポジトリ（kubon0930/bagels-panpan）と Vercel が連携済みです。
`main` ブランチに push するたびに自動でデプロイされます。

## ディレクトリ構成

```
app/            レイアウト・トップページ・グローバルCSS・favicon
components/     セクションごとのコンポーネント（Header, Hero, Menu など）
data/site.ts    店舗情報・営業情報・メニュー・FAQ・SNSリンク（編集はここ）
lib/images.ts   画像の存在チェック（写真差し替えの自動切り替え用）
public/images/  写真置き場（差し替え用）
```
