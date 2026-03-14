import tseslint from "typescript-eslint";

export default tseslint.config(...tseslint.configs.recommended, {
  { ignores: ['eslint.config.mjs'] },
  ...tseslint.configs.recommended,
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
      project: "./tsconfig.json",
    },
  },
});
