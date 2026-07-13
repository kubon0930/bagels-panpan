import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 管理画面・API・予約フローの途中ページは検索結果に不要
        disallow: ["/admin", "/api", "/reserve/confirm", "/reserve/complete"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
