<template>
	<div class="w-full text-slate-300">
		<h1 class="mb-6 text-xl font-semibold">Редактирование портфеля</h1>

		<div v-if="portfolioLoading" class="flex flex-col gap-6">
			<div class="rounded-lg overflow-hidden bg-slate-800">
				<div class="flex gap-2 border-b border-slate-600 p-3">
					<Skeleton width="10rem" height="1.5rem" />
				</div>
				<div class="flex flex-col gap-6 p-4">
					<section class="flex flex-col gap-2">
						<Skeleton width="8rem" height="1rem" class="mb-1" />
						<div class="flex items-center gap-3">
							<Skeleton shape="circle" size="2rem" />
							<Skeleton height="2.5rem" width="100%" class="max-w-md" />
						</div>
					</section>
					<section class="flex flex-col gap-4">
						<Skeleton width="6rem" height="1.25rem" />
						<div class="flex flex-wrap gap-3">
							<Skeleton width="15rem" height="3rem" />
							<Skeleton width="15rem" height="3rem" />
						</div>
					</section>
					<section class="flex flex-col gap-4">
						<Skeleton width="5rem" height="1.25rem" />
						<Skeleton height="2.5rem" width="100%" class="max-w-md" />
					</section>
				</div>
			</div>
			<div class="flex justify-between gap-3">
				<Skeleton width="5rem" height="2.5rem" />
				<Skeleton width="6rem" height="2.5rem" />
			</div>
		</div>
		<Message v-else-if="portfolioError" severity="error" variant="simple" role="alert">
			{{ portfolioError }}
		</Message>

		<template v-else>
			<Tabs
				v-model:value="activeTab"
				class="mb-6"
				:pt="{ root: { class: 'rounded-lg overflow-hidden bg-slate-800' } }"
			>
				<TabList :pt="{ root: { class: '!bg-slate-800 rounded-t-lg' } }">
					<Tab value="general">Общие настройки</Tab>
				</TabList>
				<TabPanels :pt="{ root: { class: '!bg-slate-800 rounded-b-lg' } }">
					<TabPanel value="general" :pt="{ root: { class: '!bg-slate-800' } }">
						<div class="flex flex-col gap-6">
							<section class="flex flex-col gap-2 bg-slate-800 p-4 rounded-lg">
								<label for="edit-portfolio-name" class="text-lg font-bold text-slate-100">
									Название портфеля
								</label>
								<div class="flex items-center gap-3">
									<i class="pi pi-wallet shrink-0 text-slate-400 text-xl" />
									<InputText
										id="edit-portfolio-name"
										v-model="name"
										class="flex-1"
										placeholder="Название портфеля"
										aria-label="Название портфеля"
										:invalid="!!nameError"
									/>
								</div>
								<Message v-if="nameError" severity="error" variant="simple" role="alert">
									{{ nameError }}
								</Message>
							</section>

							<section class="flex flex-col gap-4 bg-slate-800 p-4 rounded-lg">
								<h2 class="text-lg font-bold text-slate-100">Тип портфеля</h2>
								<div class="flex flex-wrap gap-3">
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

							<section class="flex flex-col gap-4 bg-slate-800 p-4 rounded-lg">
								<h2 class="text-lg font-bold text-slate-100">Брокер</h2>
								<div v-if="brokersLoading" class="flex flex-col gap-2">
									<Skeleton class="max-w-md" height="2.5rem" width="100%" />
								</div>
								<Message
									v-else-if="brokersError"
									severity="error"
									variant="simple"
									class="flex items-center gap-2"
								>
									{{ brokersError }}
									<Button label="Повторить" severity="secondary" size="small" @click="loadBrokers" />
								</Message>
								<Select
									v-else
									v-model="broker"
									:options="brokerOptions"
									option-label="label"
									option-value="value"
									placeholder="Выберите брокера"
									class="w-full max-w-md"
									:invalid="!broker && brokerOptions.length > 0"
								>
									<template #option="slotProps">
										<div class="flex items-center gap-2">
											<i class="pi pi-building text-slate-400 shrink-0" />
											<span>{{ slotProps.option.label }}</span>
										</div>
									</template>
									<template #value="slotProps">
										<div v-if="slotProps.value" class="flex items-center gap-2">
											<i class="pi pi-building text-slate-400 shrink-0" />
											<span>{{ slotProps.value?.label ?? slotProps.value }}</span>
										</div>
										<span v-else>{{ slotProps.placeholder }}</span>
									</template>
								</Select>
							</section>
						</div>
					</TabPanel>
				</TabPanels>
			</Tabs>

			<Message v-if="submitError" severity="error" class="mb-4" variant="simple" role="alert">
				{{ submitError }}
			</Message>

			<div class="flex justify-between gap-3">
				<Button label="Назад" severity="secondary" @click="goBack" />
				<Button
					label="Сохранить"
					:loading="saving"
					:disabled="saving || !canSave"
					@click="save"
				/>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useEditPortfolio } from '@/features/portfolios/composables/useEditPortfolio';
import OptionButton from '@/shared/components/OptionButton.vue';

const activeTab = ref('general');

const {
	name,
	category,
	broker,
	brokersLoading,
	brokersError,
	portfolioLoading,
	portfolioError,
	saving,
	submitError,
	nameError,
	categories,
	brokerOptions,
	canSave,
	loadBrokers,
	save,
	goBack,
} = useEditPortfolio();
</script>
