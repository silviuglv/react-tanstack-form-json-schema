import { defineConfig, globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import turboConfig from "eslint-config-turbo/flat";
import prettierConfig from "eslint-config-prettier/flat";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat["recommended-latest"],
      reactRefresh.configs.vite,
      turboConfig,
      prettierConfig,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
