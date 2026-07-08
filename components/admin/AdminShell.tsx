"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

const navItems = [
  { label: "ダッシュボード", href: "/admin" },
  { label: "販売日", href: "/admin/sales-days" },
  { label: "商品", href: "/admin/items" },
  { label: "予約一覧", href: "/admin/orders" },
];

type State = "loading" | "unconfigured" | "unauthed" | "forbidden" | "ok";

/**
 * 管理画面共通シェル。
 * ・Supabase未設定なら案内表示
 * ・未ログインなら /admin/login へ誘導
 * ・ログイン済みでも管理者(app_admins)でなければ拒否
 * 権限のチェックは is_admin() を通して行い、実データ保護は RLS が担保する。
 */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<State>("loading");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setState("unconfigured");
      return;
    }
    let active = true;
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!active) return;
      if (!sessionData.session) {
        setState("unauthed");
        return;
      }
      setEmail(sessionData.session.user.email ?? "");
      const { data: isAdmin, error } = await supabase.rpc("is_admin");
      if (!active) return;
      if (error || !isAdmin) {
        setState("forbidden");
        return;
      }
      setState("ok");
    })();
    return () => {
      active = false;
    };
  }, []);

  async function signOut() {
    const supabase = getSupabaseBrowser();
    await supabase?.auth.signOut();
    router.push("/admin/login");
  }

  if (state === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-cream text-ink/60">
        読み込み中…
      </div>
    );
  }

  if (state === "unconfigured") {
    return (
      <CenterCard title="予約システムは未設定です">
        <p>
          Supabase の環境変数が設定されていません。README の手順に沿って
          設定してください。
        </p>
      </CenterCard>
    );
  }

  if (state === "unauthed") {
    return (
      <CenterCard title="ログインが必要です">
        <Link
          href="/admin/login"
          className="mt-2 inline-flex rounded-full bg-navy px-6 py-3 font-medium text-paper hover:bg-navy-deep"
        >
          ログインページへ
        </Link>
      </CenterCard>
    );
  }

  if (state === "forbidden") {
    return (
      <CenterCard title="アクセス権限がありません">
        <p>このアカウントには管理者権限がありません。</p>
        <button
          type="button"
          onClick={signOut}
          className="mt-3 inline-flex rounded-full border border-navy/30 px-6 py-3 font-medium text-navy hover:bg-navy hover:text-paper"
        >
          ログアウト
        </button>
      </CenterCard>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-navy text-paper">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2.5 font-display text-lg font-bold">
            <BrandLogo size={32} className="border border-paper/25" />
            <span className="hidden sm:inline">予約管理</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-paper/70 md:inline">{email}</span>
            <button
              type="button"
              onClick={signOut}
              className="rounded-full border border-paper/30 px-4 py-1.5 font-medium transition-colors hover:bg-paper hover:text-navy"
            >
              ログアウト
            </button>
          </div>
        </div>
        {/* ナビ */}
        <nav className="mx-auto flex w-full max-w-5xl gap-1 overflow-x-auto px-2 sm:px-4">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "border-toast text-paper"
                    : "border-transparent text-paper/70 hover:text-paper"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

function CenterCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-cream px-5">
      <div className="w-full max-w-md rounded-card border border-line bg-warm p-8 text-center shadow-warm">
        <h1 className="text-lg font-bold text-navy">{title}</h1>
        <div className="mt-3 text-sm leading-relaxed text-ink/75">{children}</div>
      </div>
    </div>
  );
}
