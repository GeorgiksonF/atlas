<template>
	<section
		class="flex flex-col gap-4 rounded-lg border border-slate-600 bg-slate-800 p-4"
		:aria-expanded="modelValue"
	>
		<button
			type="button"
			class="flex w-full items-center gap-3 rounded-lg text-left text-slate-300 hover:bg-slate-700/50"
			@click="$emit('update:modelValue', !modelValue)"
		>
			<i :class="icon" class="shrink-0 text-slate-400" />
			<div class="flex min-w-0 flex-1 items-center gap-2">
				<h2 class="text-lg font-bold text-slate-100">
					{{ title }}
				</h2>
				<Badge :value="badge" />
			</div>
			<span class="shrink-0 text-xs text-slate-400">{{ sumLabel }}</span>
			<i
				class="pi shrink-0 text-slate-500 transition-transform"
				:class="modelValue ? 'pi-chevron-up' : 'pi-chevron-down'"
			/>
		</button>
		<Transition
			enter-active-class="transition-all duration-200 ease-out"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition-all duration-150 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div v-show="modelValue" class="flex gap-2">
				<slot />
			</div>
		</Transition>
	</section>
</template>

<script setup lang="ts">
defineProps<{
	icon: string;
	title: string;
	badge: number;
	sumLabel: string;
	modelValue: boolean;
}>();

defineEmits<{
	'update:modelValue': [value: boolean];
}>();
</script>
