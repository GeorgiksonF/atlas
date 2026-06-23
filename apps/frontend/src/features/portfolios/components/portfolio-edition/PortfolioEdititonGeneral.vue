<template>
	<div class="flex flex-col gap-6">
		<section class="flex flex-col gap-2 bg-slate-800 p-4 rounded-lg">
			<label for="edit-portfolio-name" class="text-lg font-bold text-slate-100">
				Название портфеля
			</label>
			<div class="flex items-center gap-3">
				<i class="pi pi-wallet shrink-0 text-slate-400 text-xl" />
				<FormItem :error="errorName">
					<InputText
						id="edit-portfolio-name"
						v-model="name"
						class="flex-1"
						placeholder="Название портфеля"
						aria-label="Название портфеля"
					/>
				</FormItem>
			</div>
		</section>

		<section class="flex flex-col gap-4 bg-slate-800 p-4 rounded-lg">
			<h2 class="text-lg font-bold text-slate-100">Тип портфеля</h2>
			<div class="flex flex-wrap gap-3">
				<OptionButton
					v-for="cat in categories"
					:key="cat.value"
					v-model="category"
					:option="cat"
					button-class="w-60"
				/>
			</div>
		</section>

		<section class="flex flex-col gap-4 bg-slate-800 p-4 rounded-lg">
			<h2 class="text-lg font-bold text-slate-100">Брокер</h2>
			<Select
				v-model="broker"
				:options="brokers"
				option-label="label"
				option-value="value"
				placeholder="Выберите брокера"
				class="w-full max-w-md"
			/>
		</section>
	</div>
</template>

<script setup lang="ts">
import { OptionButton, FormItem } from '@components';
import { usePortfoliosStore } from '../../stores/portfoliosStore';
import { useField } from 'vee-validate';
import { PORTFOLIO_CATEGORIES } from '@atlas/types';
import { getPortfolioCategoryLabel } from '../../utils/helper';

const categories = PORTFOLIO_CATEGORIES.map((cat) => ({
	value: cat,
	label: getPortfolioCategoryLabel(cat),
}));

const { value: name, errorMessage: errorName } = useField<string>('name');
const { value: category } = useField('category');
const { value: broker } = useField('broker');

const store = usePortfoliosStore();
const { brokers } = store;
</script>
