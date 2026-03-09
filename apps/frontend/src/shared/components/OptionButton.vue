<template>
	<button
		type="button"
		class="rounded-lg border py-3 transition-colors cursor-pointer font-semibold bg-slate-600/50 min-w-0 px-4"
		:class="[
			buttonClass,
			isSelected ? 'border-indigo-500' : (unselectedClass ?? 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700'),
		]"
		@click="$emit('update:modelValue', option.value)"
	>
		{{ option.label }}
	</button>
</template>

<script setup lang="ts" generic="T">
import { computed } from 'vue';

const props = defineProps<{
	option: { value: T; label: string };
	modelValue: T | null;
	buttonClass?: string;
	unselectedClass?: string;
}>();

defineEmits<{
	(e: 'update:modelValue', value: T): void;
}>();

const isSelected = computed(() => props.modelValue === props.option.value);
</script>
