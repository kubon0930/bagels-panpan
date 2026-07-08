import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // 予約・管理画面はマウント時に sessionStorage / Supabase セッションを読み込み、
    // その結果を state に反映する（クライアント専用の外部ストア同期）。
    // この用途では effect 内 setState が正当なため、当該ルールのみ無効化する。
    files: ["app/reserve/**/*.tsx", "app/admin/**/*.tsx", "components/admin/**/*.tsx"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
