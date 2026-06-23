<template>
	<section class="flex flex-col gap-6 p-4 bg-slate-800" role="group" aria-label="Шаг 2: брокер">
		<div class="flex flex-col gap-2">
			<h2 class="text-xl font-bold">Выберите брокера</h2>
			<p class="text-m text-slate-400">Укажите брокера, через которого ведёте счёт</p>
		</div>
		<div class="flex flex-wrap gap-3">
			<OptionButton
				v-for="opt in store.brokers"
				:key="opt.value"
				v-model="broker"
				:option="opt"
			/>
		</div>
	</section>
</template>

<script setup lang="ts">
import { OptionButton } from '@components';
import { useField } from 'vee-validate';
import { usePortfoliosStore } from '../../stores/portfoliosStore';
import { watch } from 'vue';

const store = usePortfoliosStore();
const { value: broker } = useField('broker');
const { value: name } = useField<string>('name');

watch(
	() => broker.value,
	(brokerKey) => {
		if (!brokerKey || name.value.trim()) return;

		const selected = store.brokers.find((b) => b.value === brokerKey);
		name.value = selected?.label ?? '';
	},
);
</script>
