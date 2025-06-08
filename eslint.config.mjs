import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable some strict rules for development
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      "react/no-unescaped-entities": "error",
      "@next/next/no-img-element": "warn",

      // Allow console.log in development
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",

      // Prefer const assertions over explicit any
      "prefer-const": "error",

      // React specific rules
      "react-hooks/exhaustive-deps": "warn",
      "react/display-name": "off",
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
    ],
  },
];

export default eslintConfig;