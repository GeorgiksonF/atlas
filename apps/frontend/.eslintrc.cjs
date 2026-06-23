/* eslint-env node */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:vue/vue3-recommended',
		'@vue/eslint-config-typescript',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'prettier',
	],
	plugins: ['import', 'simple-import-sort'],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	settings: {
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
				project: './tsconfig.json',
			},
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
			},
		},
	},
	rules: {
		// Vite aliases and .vue imports are resolved at build time, not by eslint-import-resolver
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
					['^vue$', '^vue-router$'],
					['^@atlas/'],
					['^@/', '^@(components|utils|layout|features|widgets|entities|composables)(/|$)'],
					['^@?\\w'],
					['^\\.'],
				],
			},
		],
		'simple-import-sort/exports': 'warn',
	},
	ignorePatterns: ['dist', 'node_modules', '*.cjs'],
};
