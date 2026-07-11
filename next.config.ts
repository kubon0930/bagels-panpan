import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Supabase Storage にアップロードした商品画像を next/image で表示できるようにする
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
