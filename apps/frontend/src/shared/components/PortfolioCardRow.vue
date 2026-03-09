<template>
	<Card
		class="w-full min-w-0 lg:w-[380px] lg:min-h-[160px] lg:max-w-[380px] hover:cursor-pointer"
		:pt="{
			root: { class: 'group !border !border-slate-600 !bg-slate-700 transition-colors hover:!border-slate-500 hover:!bg-slate-600' },
			body: { class: '!bg-slate-700 transition-colors group-hover:!bg-slate-600 rounded-lg' },
		}"
		@click="$emit('click')"
	>
		<template #content>
			<div class="flex h-full items-center justify-between gap-2 ">
				<div class="flex items-center gap-2">
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
				<div v-if="$slots.actions" @click.stop>
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

defineEmits<{
	(e: 'click'): void;
}>();
</script>
