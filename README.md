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
| `conceptScenes` | Concept の「ランチ・おうち時間・手土産」ミニカード |
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
  reserve/      予約ページ（/reserve, confirm, complete, cancel）
  admin/        管理画面（login, ダッシュボード, sales-days, items, orders）
  legal/        特商法・プライバシー・キャンセルポリシー
  api/          reserve（注文作成）, stripe/webhook
components/     セクションごとのコンポーネント
  reserve/      予約ページ用UI
  admin/        管理画面用UI（AdminShell 認証ガードなど）
data/site.ts    店舗情報・営業情報・メニュー・FAQ・SNSリンク（編集はここ）
lib/            supabase/ stripe / reservation 型 / CSV / メール など
supabase/       DBマイグレーション(0001) とサンプルデータ(seed)
public/images/  写真置き場（差し替え用）
```

---

# 予約販売システム

開店前の行列を減らし、暑い日でもお客様が安心して受け取りに来られるよう、
販売日ごとに数量限定でベーグルを事前予約できる仕組みです。
**環境変数を設定しなくても公式サイトはそのまま動きます**（予約ページは「準備中」表示）。
Supabase を設定すると予約が有効になり、Stripe を追加するとオンライン決済まで完結します。

## 決済の2モード（段階導入）

`NEXT_PUBLIC_PAYMENT_MODE` で切り替えます。

- `reservation_only`（既定）… 予約のみ・**店頭支払い**。Stripe不要。注文は即「予約確定」。
- `stripe` … Stripe Checkout で**事前決済**。決済完了で確定。未完了・期限切れ（30分）は在庫を自動で戻します。

## 環境変数一覧（`.env.example` 参照）

| 変数 | 必須 | 用途 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 推奨 | 決済の戻り先などに使うサイトURL |
| `NEXT_PUBLIC_SUPABASE_URL` | 予約に必須 | Supabase プロジェクトURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 予約に必須 | Supabase anon キー |
| `SUPABASE_SERVICE_ROLE_KEY` | 予約に必須 | サーバー専用。**公開厳禁** |
| `NEXT_PUBLIC_PAYMENT_MODE` | 予約に必須 | `reservation_only` or `stripe` |
| `STRIPE_SECRET_KEY` | 決済時のみ | Stripe シークレットキー |
| `STRIPE_WEBHOOK_SECRET` | 決済時のみ | Webhook署名シークレット |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | 任意 | 予約完了メール（未設定なら送信なし） |
| `SHOP_NOTIFICATION_EMAIL` | 任意 | 店舗への新規予約通知先 |

Vercel では Project Settings → Environment Variables に登録し、再デプロイしてください。

## 1. Supabase 設定

1. [supabase.com](https://supabase.com) でプロジェクトを作成。
2. **SQL Editor** で `supabase/migrations/0001_reservation_system.sql` の内容を貼り付けて実行
   （テーブル・RLS・在庫確認付きの注文作成関数 `create_order` などを作成）。
3. 動作確認用に `supabase/seed.sql` も実行すると、次の水曜日の販売日・商品4種（各10個）・
   受け取り時間帯3枠が入ります。
4. **商品画像を使う場合**は `supabase/migrations/0002_product_images.sql` も実行します
   （画像の保存先 `product-images` バケットと権限を作成。管理者のみアップロード可・誰でも閲覧可）。
5. **ホームページの「その日並ぶベーグル」を管理画面から編集する場合**は
   `supabase/migrations/0003_lineup_items.sql` も実行します
   （`lineup_items` テーブルを作成し、現在の5品を初期登録。画像は 0002 のバケットを流用）。
6. Project Settings → API から URL・anon キー・service_role キーを取得し環境変数に設定。

## 2. 管理者ログイン設定

1. Supabase の **Authentication → Users** で「Add user」から管理者のメール＋パスワードを作成。
2. **SQL Editor** で管理者メールを登録（このメールのユーザーだけ管理画面に入れます）:
   ```sql
   insert into public.app_admins (email) values ('店舗の管理者@example.com');
   ```
3. `/admin/login` からログイン。未ログインや非管理者は管理画面に入れません（RLSでデータも保護）。

## 3. Stripe 設定（オンライン決済を使う場合）

1. [dashboard.stripe.com](https://dashboard.stripe.com) で APIキー（シークレット）を取得し `STRIPE_SECRET_KEY` に設定。
2. `NEXT_PUBLIC_PAYMENT_MODE=stripe` にする。
3. **Webhook 設定**：Developers → Webhooks で
   エンドポイント `https://（サイトURL）/api/stripe/webhook` を追加し、
   イベント `checkout.session.completed` / `checkout.session.expired` /
   `payment_intent.payment_failed` を選択。表示された署名シークレットを
   `STRIPE_WEBHOOK_SECRET` に設定。
4. 特商法・プライバシー・キャンセルポリシー（`/legal/*`）の内容を必ず確認・修正してください。

## 4. 店舗側の使い方（管理画面）

- **販売日の登録**：`/admin/sales-days` →「＋新しい販売日」で日付・受け取り時間を作成（最初は下書き）。
  受け取り時間帯（例 12:00〜12:30、上限10）を追加し、受付開始／終了日時を設定。
- **商品の登録**：`/admin/items` で販売日を選び、商品名・価格・販売数・季節限定/おすすめ・
  アレルギーメモ・**商品画像**を登録。公開/非公開を切り替え。
  画像は「画像を選ぶ」からスマホやPCの写真をアップロード（`0002_product_images.sql` の実行が必要）。
  登録した画像はお客様の予約ページの商品カードに表示されます。
- **公開**：販売日カードの「公開」「受付中」を ON にするとお客様の `/reserve` に表示されます。
- **ホームページのラインナップ**：`/admin/lineup` で「その日並ぶベーグル」欄の内容
  （商品名・説明・タグ・画像・イラストの**ベース色×トッピング**・表示順・表示ON/OFF）を編集。
  公式サイトに最大1分で反映。イラストの選択肢は `lib/bagel-illustration.ts` で定義
  （`0004_bagel_illustration.sql` の実行が必要。未実行でも旧 `tone` からフォールバック表示）。
  `0003_lineup_items.sql` 未実行の場合は `data/site.ts` の固定内容が表示されます。
- **注文確認**：`/admin/orders` で販売日・ステータス・支払い・名前/商品で絞り込み。
  注文をタップすると詳細でステータス変更・キャンセル（在庫が戻る）・管理メモ入力が可能。
- **CSV出力**：予約一覧の「CSVで出力」で、店頭の取り置き準備・電話確認用の一覧を出力（Excel対応・BOM付き）。

## 予約番号

注文時に `BP-YYYYMM-0001` 形式で自動発行され、予約完了画面・メール・管理画面・CSVに表示されます。

## 在庫と同時予約

在庫確認と注文作成は DB関数 `create_order` 内で**行ロックを使った1トランザクション**として実行します。
複数人が同時に予約しても販売数を超えることはありません。売り切れた商品は選択できません。

## 本番公開前チェックリスト

- [ ] Supabase 本番プロジェクトを設定し、`0001_reservation_system.sql` を実行した
- [ ] RLS が有効になっている（マイグレーションで自動設定）
- [ ] `app_admins` に管理者メールを登録し、管理者以外が管理画面に入れないことを確認した
- [ ] （決済時）Stripe 本番キーを設定した
- [ ] （決済時）Stripe Webhook の署名検証が動作している
- [ ] （決済時）テスト決済が成功する
- [ ] （決済時）決済キャンセル／期限切れで在庫が戻る
- [ ] 売り切れ商品が予約できないことを確認した
- [ ] 複数人同時予約でも在庫超過しないことを確認した
- [ ] 予約完了画面に予約番号が表示される
- [ ] 管理画面に注文が表示される
- [ ] CSV が出力できる
- [ ] 特商法表記（`/legal/tokushoho`）を店舗情報で確認・修正した
- [ ] プライバシーポリシー（`/legal/privacy`）を確認・修正した
- [ ] キャンセルポリシー（`/legal/cancel-policy`）を確認・修正した
- [ ] スマホで予約できることを確認した
- [ ] `npm run build` が通る
