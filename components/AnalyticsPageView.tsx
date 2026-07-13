"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  captureUtm,
  trackPageView,
  trackReservationPageView,
} from "@/lib/analytics";

/**
 * ページビュー計測（初回表示＋クライアントサイド遷移）。
 * /reserve 表示時は予約ページ到達イベントも送る。
 * useSearchParams を使うため、layout 側で <Suspense> に包んで配置する。
 */
export default function AnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // 直前のパス（reservation_page_view の source_page 用）
  const prevPath = useRef<string>("");

  useEffect(() => {
    if (!pathname) return;
    captureUtm(searchParams);

    const query = searchParams.toString();
    trackPageView(query ? `${pathname}?${query}` : pathname);

    if (pathname === "/reserve") {
      trackReservationPageView({ sourcePage: prevPath.current });
    }
    prevPath.current = pathname;
  }, [pathname, searchParams]);

  return null;
}
