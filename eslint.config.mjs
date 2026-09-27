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
      '.claude/worktrees/**',
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
    },
  },
  {
    // CLI scripts report through stdout.
    files: ['scripts/**'],
    rules: { 'no-console': 'off' },
  },
];

export default eslintConfig;
