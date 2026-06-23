<template>
	<div class="flex justify-center px-2 pt-15">
		<Button
		class="sidebar-action w-full flex flex-row items-center justify-center gap-2 rounded-lg py-2.5"
		:class="isOpen ? 'px-4' : 'px-0'"
		@click="toggleQuickActionsMenu"
	>
		<i class="pi pi-plus shrink-0" :class="isOpen ? 'text-base' : 'text-lg'" />
		<Transition name="fade">
			<span v-show="isOpen" class="text-sm font-medium">Действия</span>
		</Transition>
	</Button>
	<Menu id="actions-menu" ref="menu" :model="quickActions" :popup="true" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useAppQuickActions } from '@composables'

defineProps<{isOpen: boolean}>()

const { quickActions } = useAppQuickActions();

const menu = ref();

const toggleQuickActionsMenu = (e: Event) => menu.value.toggle(e);
</script>