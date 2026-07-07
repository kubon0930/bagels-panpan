/**
 * サイト全体で使う店舗情報・営業情報・メニュー・FAQ・SNSリンクの定義。
 * 情報が変わったときは、このファイルだけを編集すれば全ページに反映されます。
 */

// TODO: 独自ドメイン取得後は実際のURLに変更してください（layout.tsx の metadataBase にも反映されます）。
export const siteUrl = "https://bagels-panpan.vercel.app";

export const shopInfo = {
  /** 基本表記（ピリオドまで含めて店名） */
  name: "Bagels Panpan.",
  /** ロゴ風の大きな見出しで使う表記 */
  logoName: "BAGELS PANPAN.",
  genre: "ベーグル専門店",
  address: "東京都板橋区常盤台1-61-6",
  station: "中板橋駅",
  access: "中板橋駅から徒歩約2分",
  /** Hero などで使う小さな英字ラベル */
  areaLabel: "Nakaitabashi / Tokyo",
  services: "テイクアウト",
  reservation: "予約不可",
  payment: "QRコード決済可（カード・電子マネー不可）",
  brandCopy: "もちっと、今日を満たすベーグル。",
  /** 店頭の目印（Access で使用） */
  landmark: "ネイビーの外観と「Bagels Panpan.」の白い看板が目印です。",
} as const;

/** ブランド画像のパス。public/images/ に同名ファイルを置くと反映されます。 */
export const brandImages = {
  /** Instagramアイコン風の丸いネイビーロゴ */
  logo: "/images/panpan-logo-circle.jpg",
  /** 店舗外観写真（ネイビーの看板と白いタペストリー） */
  storefront: "/images/panpan-storefront.jpg",
  /** OGP画像（SNSシェア用 1200x630） */
  ogp: "/images/ogp-placeholder.jpg",
} as const;

export const businessHours = {
  /** 短い表記（ヘッダー・フッター用） */
  openDaysShort: "水・金・土",
  /** 長い表記（FAQ・本文用） */
  openDaysLong: "水曜日・金曜日・土曜日",
  hours: "12:00〜売り切れまで",
  closedDaysShort: "月・火・木・日・祝日",
  closedDaysLong: "月曜日・火曜日・木曜日・日曜日・祝日",
  irregularNote: "臨時休業あり",
  /** Hero などで1行で見せる表記 */
  oneLine: "水・金・土｜12:00〜売り切れまで",
  /** サイト内の各所で繰り返し使う案内文 */
  instagramNote: "最新情報はInstagramをご確認ください。",
  /** オープン時間変更の注意書き（短） */
  cautionNote:
    "オープン時間は変更となる場合があります。ご来店前にInstagramで最新情報をご確認ください。",
  /** オープン時間変更の注意書き（長） */
  cautionNoteLong:
    "オープン時間は変更になる可能性があります。最新情報は随時Instagramにてお知らせします。",
} as const;

/** 営業日カレンダー表示用（Access セクションの曜日チップ） */
export const weekDays = ["月", "火", "水", "木", "金", "土", "日"] as const;
export const openWeekDays = ["水", "金", "土"] as const;

export const socialLinks = {
  instagram: "https://www.instagram.com/bakery_panpan",
  instagramHandle: "@bakery_panpan",
  tabelog: "https://tabelog.com/tokyo/A1322/A132203/13314780/",
} as const;

/** Google Map の店舗ページ（「Google Mapで見る」リンク先） */
export const googleMapsUrl =
  "https://www.google.com/maps/place/Bagels+Panpan./@35.7575781,139.6948345,17z/data=!3m1!4b1!4m6!3m5!1s0x6018930022117fbf:0xf2b2c5e17d6cbc34!8m2!3d35.7575781!4d139.6948345!16s%2Fg%2F11x_5s9hc1";

/** 店舗の座標（地図埋め込みに使用） */
export const shopLatLng = "35.7575781,139.6948345";

/** Hero に表示する小さな情報バッジ */
export const heroBadges = [
  "Nakaitabashi / Tokyo",
  "Takeout Bagels",
  "Open Wed, Fri, Sat",
  "From 12:00",
  "Until sold out",
] as const;

/** ベーグルグラフィックの焼き色バリエーション（components/BagelGraphic.tsx） */
export type BagelTone = "golden" | "cheese" | "chocolate" | "seasonal";

export type MenuItem = {
  /** 商品名（英字） */
  name: string;
  /** 商品名（日本語・任意） */
  nameJa?: string;
  description: string;
  /** 限定商品などのタグ（任意） */
  tag?: string;
  /** 仮グラフィックの焼き色（写真設定時は無視されます） */
  tone?: BagelTone;
  /**
   * 商品写真のパス（任意）。
   * public/images/ に写真を置いて "/images/plain.jpg" のように指定すると
   * カードのグラフィックが写真に差し替わります。
   */
  image?: string;
};

// TODO: 実際の商品名・説明文が確定したら差し替えてください。
export const menuItems: MenuItem[] = [
  {
    name: "Plain Bagel",
    nameJa: "プレーン",
    description: "小麦の香りともちもち食感を楽しむ、まず食べたい定番ベーグル。",
    tone: "golden",
  },
  {
    name: "Sesame Bagel",
    nameJa: "セサミ",
    description: "香ばしいごまの風味が広がる、食事にも合わせやすい一品。",
    tone: "golden",
  },
  {
    name: "Cheese Bagel",
    nameJa: "チーズ",
    description: "焼き上がりのチーズの香りが食欲をそそる人気メニュー。",
    tone: "cheese",
  },
  {
    name: "Chocolate Bagel",
    nameJa: "チョコレート",
    description: "ほんのり甘く、コーヒーにもよく合うおやつ系ベーグル。",
    tone: "chocolate",
  },
  {
    name: "Seasonal Bagel",
    nameJa: "季節限定",
    description: "季節の素材を使った、その時だけの限定ベーグル。",
    tag: "Limited",
    tone: "seasonal",
  },
];

/** Concept セクションの「毎日のシーン」ミニカード */
export const conceptScenes = [
  {
    title: "朝ごはんに",
    text: "焼きたてをそのまま、シンプルに。",
  },
  {
    title: "ランチに",
    text: "好きな具材をはさんで、自分だけのサンドに。",
  },
  {
    title: "手土産に",
    text: "紙袋に詰めて、大切な人への小さな贈りものに。",
  },
] as const;

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "営業日はいつですか？",
    answer:
      "基本の営業日は水曜日・金曜日・土曜日です。営業日や臨時休業は変更となる場合があるため、最新情報はInstagramをご確認ください。",
  },
  {
    question: "何時から営業していますか？",
    answer:
      "基本は12:00から営業し、売り切れ次第終了となります。オープン時間は変更になる可能性があるため、随時Instagramにてお知らせします。",
  },
  {
    question: "予約はできますか？",
    answer: "現在、予約は不可です。",
  },
  {
    question: "テイクアウトできますか？",
    answer: "はい、テイクアウトでご利用いただけます。",
  },
  {
    question: "支払い方法は？",
    answer:
      "QRコード決済に対応しています。カード・電子マネーはご利用いただけません。",
  },
  {
    question: "売り切れることはありますか？",
    answer:
      "ひとつひとつ手づくりのため、売り切れ次第終了となります。早めのご来店がおすすめです。",
  },
  {
    question: "最新情報はどこで確認できますか？",
    answer:
      "Instagramにて営業日、オープン時間、臨時休業、焼き上がり情報をお知らせしています。",
  },
];

/** Instagramセクションで伝える発信内容 */
export const instagramCards = [
  {
    title: "本日の焼き上がり",
    caption: "今日のラインナップをお知らせしています",
  },
  {
    title: "季節のベーグル",
    caption: "その時期だけの限定フレーバー",
  },
  {
    title: "営業日・オープン時間",
    caption: "臨時休業や時間変更のお知らせはこちらから",
  },
] as const;
