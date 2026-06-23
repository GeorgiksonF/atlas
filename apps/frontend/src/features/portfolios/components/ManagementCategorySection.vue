<template>
	<section class="flex flex-col rounded-lg border border-slate-600 bg-slate-800 p-4">
		<button
			type="button"
			class="flex w-full items-center gap-3 rounded-lg text-left text-slate-300 cursor-pointer"
			:aria-expanded="modelValue"
			@click="modelValue = !modelValue"
		>
			<i :class="category.icon" class="shrink-0 text-slate-400" />
			<div class="flex min-w-0 flex-1 items-center gap-2">
				<h2 class="text-lg font-bold text-slate-100">
					{{ category.title }}
				</h2>
				<Badge :value="category.badge" />
			</div>
			<span class="text-xs text-slate-400">{{ category.portfolioValue }}</span>
			<i
				class="pi shrink-0 text-slate-500 transition-transform"
				:class="modelValue ? 'pi-chevron-up' : 'pi-chevron-down'"
			/>
		</button>
		<div
			class="grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none"
			:style="{ gridTemplateRows: modelValue ? '1fr' : '0fr' }"
		>
			<div class="min-h-0 overflow-hidden">
				<div class="flex gap-4 pt-4">
					<slot />
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { Category } from '../composables/usePortfolioGrouped';

defineProps<{
	category: Category;
}>();

const modelValue = defineModel<boolean>();
</script>
