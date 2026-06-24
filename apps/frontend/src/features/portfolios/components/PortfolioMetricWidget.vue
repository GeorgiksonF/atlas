<template>
	<div
		class="flex min-h-0 flex-col gap-2 rounded-lg border border-slate-600 bg-slate-800/80 p-4"
	>
		<div
			class="flex items-center gap-2 text-xs font-medium tracking-wide text-slate-400 uppercase"
		>
			<i :class="[icon, 'mt-0.5 shrink-0 text-sm']" aria-hidden="true" />
			<span class="min-w-0 leading-tight">{{ label }}</span>
			<i
				v-tooltip.top="{
					value: tooltip,
					pt: { text: { style: 'width: 420px' } },
				}"
				class="pi pi-info-circle ml-auto shrink-0 cursor-help text-slate-500 text-base"
				role="img"
				:aria-label="`Справка: ${label}`"
			/>
		</div>
		<div class="min-h-8 text-lg font-semibold text-slate-100">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	label: string;
	tooltip: string;
	icon: string;
}>();
</script>
