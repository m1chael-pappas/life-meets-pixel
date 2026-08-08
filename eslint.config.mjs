// Native ESLint flat config.
//
// This used to route `next/core-web-vitals` and `next/typescript` through
// FlatCompat from @eslint/eslintrc. eslint-config-next 16 ships real flat
// configs, and pushing those back through the eslintrc shim throws on a
// circular `plugins.react` reference — so the shim is gone and the configs are
// imported directly, which is also what ESLint 10 will require.
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  // Flat config has no implicit ignores beyond node_modules, and `ignores` in a
  // block that also carries `rules` only scopes that block. A global ignore has
  // to be its own object.
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'studio/**',
      'next-env.d.ts',
      // A library of reference snippets for Sanity operations, not executed
      // code — every export is unused by design. `next lint` never saw it
      // (it only scanned app/components/lib/pages/src); `eslint .` does.
      'scripts/examples.ts',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Kept verbatim from the previous config.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'react/no-unescaped-entities': 'error',
      '@next/next/no-img-element': 'warn',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'prefer-const': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/display-name': 'off',

      // New in eslint-config-next 16, from the React Compiler rule set. It
      // fires on four components — the header clock, the tweaks panel, the
      // comment gate and the ad slot — and in every case the setState is the
      // hydration-safe pattern, not a cascading render: the value cannot exist
      // during SSR (Date.now(), localStorage, window.adsbygoogle) so it has to
      // be set after mount or the markup mismatches.
      //
      // Kept as a warning rather than silenced: useSyncExternalStore is the
      // right long-term answer for the localStorage ones. Downgraded rather
      // than fixed because rewriting working effects is a refactor, not part
      // of a version upgrade.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default eslintConfig;
