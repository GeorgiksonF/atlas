<template>
	<div
		class="cursor-pointer group relative flex w-full items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5"
		:class="active ? 'bg-slate-600 text-slate-100' : 'text-slate-200 hover:bg-slate-700'"
		@click="$emit('click')"
	>
		<div type="button" class="flex min-w-0 flex-1 items-center gap-3 text-left">
			<i :class="icon" class="shrink-0 text-slate-400" />
			<div class="min-w-0 flex-1">
				<div class="truncate text-sm font-medium">
					{{ portfolio.name }}
				</div>
				<div v-if="portfolio.category" class="text-xs text-slate-400">
					{{ portfolio.category }}
				</div>
			</div>
			<span v-if="value" class="shrink-0 text-xs text-slate-400">
				{{ value }}
			</span>
		</div>
		<div
			class="flex shrink-0 items-center overflow-hidden transition-[width] duration-200 ease-out"
			:class="actionsPinned ? 'w-10' : 'w-0 group-hover:w-10'"
		>
			<div
				class="flex w-10 shrink-0 justify-end transition-transform duration-200 ease-out"
				:class="
					actionsPinned ? 'translate-x-0' : 'translate-x-full group-hover:translate-x-0'
				"
			>
				<div v-if="menuItems.length" class="flex shrink-0 items-center pr-2">
					<Button
						icon="pi pi-ellipsis-v"
						text
						rounded
						size="small"
						aria-label="Действия со счётом"
						@click.stop="menuRef?.toggle($event)"
					/>
				</div>
			</div>
			<Menu ref="menuRef" :model="menuItems" :popup="true" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { MenuItem } from 'primevue/menuitem';

import type { PortfolioContext } from '../model';

const menuRef = ref<{ toggle: (e: Event) => void } | null>(null);

withDefaults(
	defineProps<{
		icon: string;
		value?: string;
		portfolio: PortfolioContext;
		active: boolean;
		actionsPinned?: boolean;
		menuItems?: MenuItem[];
	}>(),
	{
		value: undefined,
		actionsPinned: false,
		menuItems: () => [],
	},
);

defineEmits<{
	click: [];
}>();
</script>
