<template>
	<section
		class="flex flex-col gap-6 bg-slate-800 p-4"
		role="group"
		aria-label="Шаг 3: название портфеля"
	>
		<div class="flex flex-col gap-2">
			<h2 class="text-xl font-bold">Название портфеля</h2>
			<p class="text-m text-slate-400">
				Введите название, по которому вы будете узнавать этот счёт
			</p>
		</div>
		<div class="flex flex-col gap-2 bg-slate-600/50 p-4 rounded-lg">
			<div class="flex items-center gap-2">
				<i
					v-tooltip.top="{
						value: 'Вы можете изменить название в любой момент в настройках портфеля.',
						pt: { text: { style: 'width: 400px' } },
					}"
					class="pi pi-info-circle text-slate-400 cursor-help text-lg shrink-0"
					aria-label="Подсказка"
				/>
				<InputText
					v-model="value"
					class="w-full"
					placeholder="Например: ИИС или Брокер Тинькофф"
					aria-label="Название портфеля"
				/>
			</div>
			<Message v-if="errorMessage" severity="error" variant="simple" role="alert">
				{{ errorMessage }}
			</Message>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';

const { value, errorMessage } = useField<string>('name');
</script>
