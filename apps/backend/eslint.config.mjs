// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['eslint.config.mjs'],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	eslintPluginPrettierRecommended,
	importPlugin.flatConfigs.recommended,
	importPlugin.flatConfigs.typescript,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},
			sourceType: 'commonjs',
			parserOptions: {
				tsconfigRootDir: import.meta.dirname,
				project: [
					'./tsconfig.json',
					'./tsconfig.eslint.json',
					'../../libs/types/tsconfig.json',
				],
			},
		},
		settings: {
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: ['./tsconfig.json', './tsconfig.eslint.json'],
				},
			},
		},
	},
	{
		plugins: {
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/no-unsafe-argument': 'warn',
			'prettier/prettier': ['error', { endOfLine: 'auto' }],
			'import/no-unresolved': 'off',
			'import/order': 'off',
			'import/no-duplicates': 'error',
			'import/newline-after-import': 'error',
			'simple-import-sort/imports': [
				'warn',
				{
					groups: [
						['^\\u0000'],
						['^node:'],
						['^@nestjs/'],
						['^@atlas/'],
						['^@?\\w'],
						['^\\.'],
					],
				},
			],
			'simple-import-sort/exports': 'warn',
		},
	},
);
