<template>
	<div
		class="flex flex-row items-center gap-2 cursor-pointer"
		@click="toggle"
		aria-controls="user-profile-menu"
	>
		<Avatar shape="circle" label="G" class="mr-2" />
		<div class="text-slate-50">
			<h1>Georgiy</h1>
		</div>
		<!-- <Button :icon="menu ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down'" rounded /> -->
		<Menu ref="menu" :model="menuItems" :popup="true" id="user-profile-menu" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const menuItems = ref([
	{
		label: 'Профиль',
		icon: 'fa-solid fa-user',
		url: '/profile',
	},
	{
		label: 'Выйти',
		icon: 'fa-solid fa-right-from-bracket',
		url: '/logout',
	},
]);
const menu = ref();

const toggle = (e: Event) => {
	menu.value.toggle(e);
};
</script>

<style scoped></style>
