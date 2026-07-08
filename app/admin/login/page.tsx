"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = getSupabaseBrowser();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setError("予約システムが未設定です。");
      return;
    }
    setError("");
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError("メールアドレスまたはパスワードが正しくありません。");
      setLoading(false);
      return;
    }
    // 管理者判定
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (!isAdmin) {
      await supabase.auth.signOut();
      setError("このアカウントには管理者権限がありません。");
      setLoading(false);
      return;
    }
    router.push("/admin");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-navy px-5">
      <div className="w-full max-w-sm rounded-card bg-warm p-8 shadow-warm-lg">
        <div className="flex flex-col items-center">
          <BrandLogo size={56} />
          <h1 className="mt-4 text-lg font-bold text-navy">予約管理ログイン</h1>
          <p className="mt-1 text-xs text-ink/60">Bagels Panpan.</p>
        </div>

        {!supabase && (
          <p className="mt-6 rounded-lg bg-bagel/10 px-4 py-3 text-center text-sm text-bagel">
            Supabase が未設定です。READMEの手順で設定してください。
          </p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">メールアドレス</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-navy"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">パスワード</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-navy"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-bagel/10 px-3 py-2 text-center text-sm font-medium text-bagel">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !supabase}
            className="w-full rounded-full bg-navy py-3.5 font-bold text-paper transition-colors hover:bg-navy-deep disabled:opacity-50"
          >
            {loading ? "ログイン中…" : "ログイン"}
          </button>
        </form>

        <Link href="/" className="mt-6 block text-center text-xs text-ink/60 underline underline-offset-4">
          公式サイトへ戻る
        </Link>
      </div>
    </div>
  );
}
