<template>
	<section class="flex flex-col gap-6 p-4 bg-slate-800" role="group" aria-label="Шаг 2: брокер">
		<div class="flex flex-col gap-2">
			<h2 class="text-xl font-bold">Выберите брокера</h2>
			<p class="text-m text-slate-400">Укажите брокера, через которого ведёте счёт</p>
		</div>
		<div class="flex flex-wrap gap-3">
			<OptionButton
				v-for="opt in brokers"
				:key="opt.value"
				v-model="modelValue"
				:option="opt"
			/>
		</div>
	</section>
</template>

<script setup lang="ts">
import type { BrokerResponse, PortfolioBroker } from '@atlas/types';
import { OptionButton } from '@components';

defineProps<{ brokers: BrokerResponse[] }>();
const modelValue = defineModel<PortfolioBroker | null>('modelValue');
</script>
