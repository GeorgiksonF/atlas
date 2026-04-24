<script setup lang="ts">
defineProps<{
	label: string;
	error?: string;
}>();
</script>

<template>
	<div class="flex flex-col gap-2">
		<label class="text-sm font-medium text-slate-300">{{ label }}</label>
		<slot />
		<Message v-if="error" severity="error" variant="simple" class="w-full">
			{{ error }}
		</Message>
	</div>
</template>
