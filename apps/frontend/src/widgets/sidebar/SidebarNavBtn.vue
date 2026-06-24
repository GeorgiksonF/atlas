<template>
	<RouterLink
		:key="label"
		:to="url"
		active-class="sidebar-item-active"
		class="sidebar-item flex flex-row items-center gap-3 rounded-lg py-2.5 text-slate-200 transition-colors"
		:class="[isOpen ? 'px-4' : 'justify-center px-0']"
	>
		<i :class="icon" class="text-lg shrink-0 w-6 text-center" />
		<Transition name="fade">
			<span v-show="isOpen" class="text-sm font-medium">{{ label }}</span>
		</Transition>
	</RouterLink>
</template>

<script setup lang="ts">
	defineProps<{
		isOpen: boolean,
		label: string,
		url: string,
		icon?: string
	}>()
</script>