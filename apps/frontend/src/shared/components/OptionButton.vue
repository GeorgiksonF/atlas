<template>
	<button
		type="button"
		class="rounded-lg border py-3 transition-colors cursor-pointer font-semibold bg-slate-600/50 min-w-0 px-4"
		:class="[
			buttonClass,
			isSelected
				? 'border-indigo-500'
				: 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700',
		]"
		@click="modelValue = option.value"
	>
		{{ option.label }}
	</button>
</template>

<script setup lang="ts" generic="T">
import { computed } from 'vue';

const props = withDefaults(
	defineProps<{
		option: { value: T; label: string };
		buttonClass?: string;
	}>(),
	{
		buttonClass: '',
	},
);

const modelValue = defineModel<T | null>('modelValue');

const isSelected = computed(() => modelValue.value === props.option.value);
</script>
