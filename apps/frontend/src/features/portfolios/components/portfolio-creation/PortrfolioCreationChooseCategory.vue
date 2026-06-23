<template>
	<section
		class="flex flex-col gap-6 bg-slate-800 p-4"
		role="group"
		aria-label="Шаг 1: тип портфеля"
	>
		<div class="flex flex-col gap-2">
			<h2 class="text-xl font-bold">Выберите тип портфеля</h2>
			<p class="text-m text-slate-400">Выберите тип портфеля, который вы хотите создать</p>
		</div>
		<div class="flex gap-3">
			<OptionButton
				v-for="cat in categories"
				:key="cat.value"
				v-model="category"
				:option="cat"
				button-class="w-60"
			/>
		</div>
	</section>
</template>

<script setup lang="ts">
import { OptionButton } from '@components';

import { useField } from 'vee-validate';

import { PORTFOLIO_CATEGORY_LABELS } from '../../constants/constants';

const categories = Object.entries(PORTFOLIO_CATEGORY_LABELS).map(([value, label]) => ({
	value: value,
	label,
}));

const { value: category } = useField('category');
</script>
