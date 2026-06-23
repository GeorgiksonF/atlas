<template>
	<div>
		<div class="mb-6">
			<IconField icon-position="left" class="w-full">
				<InputIcon class="pi pi-search" />
				<InputText
					v-model="searchQuery"
					class="w-full"
					placeholder="Поиск по названию портфеля"
					aria-label="Поиск по названию портфеля"
				/>
			</IconField>
		</div>

		<div class="mb-4 flex flex-col gap-4 rounded-lg border border-slate-600 bg-slate-800 p-4">
			<PortfolioCard icon="pi pi-th-large" :portfolio="ALL_PORTFOLIOS_CONTEXT" />
		</div>

		<div v-if="loading" class="flex flex-col gap-4">
			<div
				v-for="i in 4"
				:key="i"
				class="flex items-center gap-3 rounded-lg border border-slate-600 bg-slate-800 p-4"
			>
				<Skeleton shape="circle" size="2rem" />
				<div class="flex flex-1 flex-col gap-2">
					<Skeleton width="12rem" height="1rem" />
					<Skeleton width="8rem" height="0.75rem" />
				</div>
				<Skeleton shape="circle" size="2rem" />
			</div>
		</div>

		<div v-else class="flex flex-col gap-4">
			<ManagementCategorySection
				v-for="category in visibleCategories"
				:key="category.key"
				v-model="expandedByCategory[category.key]"
				:category
			>
				<PortfolioCard
					v-for="p in category.portfolios"
					:key="p.id"
					:portfolio="p"
					icon="pi pi-wallet"
				/>
			</ManagementCategorySection>
		</div>
	</div>
</template>

<script setup lang="ts">
import ManagementCategorySection from './ManagementCategorySection.vue';
import PortfolioCard from './PortfolioCard.vue';
import { usePortfolioGrouped } from '../composables/usePortfolioGrouped.ts';
import { ALL_PORTFOLIOS_CONTEXT } from '../stores/portfoliosStore';

const { visibleCategories, expandedByCategory, searchQuery, loading } = usePortfolioGrouped();
</script>
