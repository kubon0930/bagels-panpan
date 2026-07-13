"use client";

import Link from "next/link";
import { reservePath } from "@/data/site";
import {
  trackReservationClick,
  type ReservationButtonLocation,
} from "@/lib/analytics";

type ReservationLinkProps = {
  /** 遷移先（省略時は /reserve） */
  href?: string;
  /** 設置場所（GA4の button_location として送信） */
  buttonLocation: ReservationButtonLocation;
  /** ボタン文言（GA4の button_text として送信） */
  text: string;
  className?: string;
  id?: string;
  onClick?: () => void;
  children: React.ReactNode;
};

/**
 * 予約ページへのCTA共通コンポーネント。
 * クリック時に GA4 の reservation_click を送信する（遷移は妨げない）。
 * サイト内のすべての予約導線はこのコンポーネントを使うこと。
 */
export default function ReservationLink({
  href = reservePath,
  buttonLocation,
  text,
  className,
  id,
  onClick,
  children,
}: ReservationLinkProps) {
  return (
    <Link
      id={id}
      href={href}
      className={className}
      onClick={() => {
        trackReservationClick({
          location: buttonLocation,
          text,
          destination: href,
        });
        onClick?.();
      }}
    >
      {children}
    </Link>
  );
}
