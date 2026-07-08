// このファイルはサーバー（Server Component / Route Handler）専用。
// service role キーを扱うため、クライアントコンポーネントから import しないこと。
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * サーバー用 Supabase クライアント（anonキー）。
 * 公開データの読み取りに使う（RLS の公開ポリシーが適用される）。
 */
export function getSupabaseAnonServer(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * サーバー専用 Supabase クライアント（service role キー）。
 * RLS をバイパスするため、API ルート内でのみ使用し、絶対にクライアントへ渡さない。
 */
export function getSupabaseService(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
