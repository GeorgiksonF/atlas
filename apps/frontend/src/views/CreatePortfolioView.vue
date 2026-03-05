<template>
	<div class="w-full text-slate-300">
		<h1 class="mb-6 text-xl font-semibold">Новый портфель</h1>

		<section
			v-if="step === STEPS.TYPE"
			class="flex flex-col gap-6 bg-slate-800 p-4 rounded-lg"
			role="group"
			aria-label="Шаг 1: тип портфеля"
		>
			<div class="flex flex-col gap-2">
				<p class="text-sm text-slate-400">Шаг 1</p>
				<h2 class="text-xl font-bold">Выберите тип портфеля</h2>
				<p class="text-m text-slate-400">
					Выберите тип портфеля, который вы хотите создать
				</p>
			</div>
			<div class="flex gap-3">
				<OptionButton
					v-for="cat in categories"
					:key="cat.value"
					:option="cat"
					:model-value="category"
					button-class="w-60"
					@update:model-value="category = $event"
				/>
			</div>
		</section>

		<section
			v-else-if="step === STEPS.BROKER"
			class="flex flex-col gap-6 bg-slate-800 p-4 rounded-lg"
			role="group"
			aria-label="Шаг 2: брокер"
		>
			<div class="flex flex-col gap-2">
				<p class="text-sm text-slate-400">Шаг 2</p>
				<h2 class="text-xl font-bold">Выберите брокера</h2>
				<p class="text-m text-slate-400">Укажите брокера, через которого ведёте счёт</p>
			</div>
			<div v-if="brokersLoading" class="text-slate-400">Загрузка списка брокеров...</div>
			<Message v-else-if="brokersError" severity="error" variant="simple" class="flex items-center gap-2">
				{{ brokersError }}
				<Button label="Повторить" severity="secondary" size="small" @click="loadBrokers" />
			</Message>
			<div v-else class="flex flex-wrap gap-3">
				<OptionButton
					v-for="opt in brokerOptions"
					:key="opt.value"
					:option="opt"
					:model-value="broker"
					@update:model-value="broker = $event"
				/>
			</div>
		</section>

		<section
			v-else-if="step === STEPS.NAME"
			class="flex flex-col gap-6 bg-slate-800 p-4 rounded-lg"
			role="group"
			aria-label="Шаг 3: название портфеля"
		>
			<div class="flex flex-col gap-2">
				<p class="text-sm text-slate-400">Шаг 3</p>
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
						:id="nameInputId"
						v-model="name"
						class="w-full"
						placeholder="Например: ИИС или Брокер Тинькофф"
						aria-label="Название портфеля"
						:invalid="!!nameError"
						:aria-invalid="!!nameError"
						:aria-describedby="nameError ? `${nameInputId}-error` : undefined"
					/>
				</div>
				<Message
					v-if="nameError"
					:id="`${nameInputId}-error`"
					severity="error"
					variant="simple"
					role="alert"
				>
					{{ nameError }}
				</Message>
			</div>
		</section>

		<Message v-if="submitError" severity="error" class="mt-4" variant="simple" role="alert">
			{{ submitError }}
		</Message>

		<div class="mt-6 flex justify-between gap-3">
			<Button v-if="step > STEPS.TYPE" label="Назад" severity="secondary" @click="prevStep" />
			<span v-else />
			<template v-if="step < STEPS.NAME">
				<Button label="Далее" :disabled="!canProceed" @click="nextStep" />
			</template>
			<template v-else>
				<Button
					label="Создать"
					:loading="loading"
					:disabled="loading || !canSubmit"
					@click="onSubmit"
				/>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCreatePortfolio } from '@/features/portfolios/composables/useCreatePortfolio';
import { STEPS } from '@/features/portfolios/utils/createPortfolioValidation';
import OptionButton from '@/shared/components/OptionButton.vue';

const {
	step,
	category,
	broker,
	name,
	brokers,
	brokersLoading,
	brokersError,
	loading,
	submitError,
	categories,
	nameError,
	canProceed,
	canSubmit,
	loadBrokers,
	onSubmit,
	nextStep,
	prevStep,
} = useCreatePortfolio();

onMounted(() => {
	loadBrokers();
});

const nameInputId = 'create-portfolio-name';

const brokerOptions = computed(() =>
	brokers.value.map((b) => ({ value: b, label: b })),
);
</script>
