<template>
	<div>
		<div v-if="isPortfolioFetching" class="flex flex-col gap-6">
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
						<PortfolioEditionGeneral />
					</TabPanel>
				</TabPanels>
			</Tabs>

			<div class="flex justify-between gap-3">
				<Button label="Назад" severity="secondary" @click="router.back()" />
				<Button
					label="Сохранить"
					:loading="isSaving"
					:disabled="isSaving || !meta.valid"
					@click="save"
				/>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useEditPortfolioForm } from '../composables/useEditPortfolioForm';
import PortfolioEditionGeneral from './portfolio-edition/PortfolioEditionGeneral.vue';

const router = useRouter();
const route = useRoute();

const activeTab = ref('general');

const portfolioId = computed(() => {
	const id = route.params.id;
	return Array.isArray(id) ? id[0] : id;
});

const {
	save,
	loading: isSaving,
	meta,
	isPortfolioFetching,
} = useEditPortfolioForm(portfolioId);
</script>
