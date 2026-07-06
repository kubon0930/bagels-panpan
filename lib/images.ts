import fs from "node:fs";
import path from "node:path";

/**
 * public/ 配下に画像が存在するかをビルド時に判定する（Server Component 専用）。
 * 写真がまだ用意できていない箇所を、プレースホルダー表示に切り替えるために使う。
 * 画像を追加したら再ビルド（Vercel なら push）で反映されます。
 */
export function publicImageExists(publicPath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", publicPath));
}
