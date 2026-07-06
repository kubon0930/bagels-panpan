import { shopInfo, shopLatLng } from "@/data/site";

type GoogleMapProps = {
  className?: string;
};

/**
 * Google Map の埋め込み。
 * 実店舗の座標（data/site.ts の shopLatLng）を中心に、店名で検索した結果を表示する。
 */
export default function GoogleMap({ className = "" }: GoogleMapProps) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(
    `${shopInfo.name} ${shopInfo.address}`,
  )}&ll=${shopLatLng}&z=17&output=embed`;

  return (
    <div
      className={`overflow-hidden rounded-3xl border border-wheat bg-milk ${className}`}
    >
      <iframe
        src={src}
        title={`${shopInfo.name} の地図（Google Map）`}
        className="h-full min-h-80 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
