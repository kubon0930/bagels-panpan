"use client";

import { trackOutboundClick, type OutboundLinkType } from "@/lib/analytics";

type OutboundLinkProps = {
  href: string;
  /** リンク種別（instagram / map / tabelog / other）。GA4の link_type として送信 */
  linkType: OutboundLinkType;
  /** リンク文言（GA4の link_text として送信） */
  text: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
};

/**
 * 外部リンクの共通コンポーネント（新しいタブで開く）。
 * クリック時に GA4 の outbound_click（Instagram/地図は専用イベントも）を送信する。
 */
export default function OutboundLink({
  href,
  linkType,
  text,
  className,
  onClick,
  children,
}: OutboundLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        trackOutboundClick({ linkType, text, destination: href });
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}
