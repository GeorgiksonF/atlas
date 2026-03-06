<template>
	<Card
		class="w-full min-w-0 lg:w-[380px] lg:min-h-[160px] lg:max-w-[380px]"
		:pt="cardPt"
	>
		<template #content>
			<div class="flex h-full items-center justify-between gap-2">
				<div class="flex min-w-0 flex-1 items-center gap-2">
					<i :class="icon" class="shrink-0 text-slate-400" />
					<div class="min-w-0">
						<div class="truncate text-sm font-medium text-slate-100">
							{{ title }}
						</div>
						<div v-if="subtitle" class="truncate text-xs text-slate-400">
							{{ subtitle }}
						</div>
					</div>
				</div>
				<div v-if="$slots.actions" class="shrink-0">
					<slot name="actions" />
				</div>
			</div>
		</template>
	</Card>
</template>

<script setup lang="ts">
defineProps<{
	icon: string;
	title: string;
	subtitle?: string;
}>();

const cardPt = {
	root: { class: 'rounded-lg border border-slate-600 bg-slate-600/50' },
	body: { class: 'p-3' },
	content: { class: 'p-0' },
};
</script>
