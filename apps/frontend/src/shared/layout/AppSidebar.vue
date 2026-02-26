<template>
	<aside
		class="min-h-screen flex flex-col bg-slate-800 border-r border-slate-600 transition-[width] duration-300 ease-out relative group shrink-0"
		:class="isOpen ? 'w-64' : 'w-20'"
	>
		<div
			class="absolute top-20 -right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
		>
			<Button
				:icon="isOpen ? 'pi pi-chevron-left' : 'pi pi-chevron-right'"
				severity="secondary"
				rounded
				size="small"
				aria-label="sidebar-toggle"
				class="shadow-md!"
				@click="isOpen = !isOpen"
			/>
		</div>

		<div class="flex justify-center pt-5 pb-2">
			<RouterLink
				to="/app"
				class="sidebar-link flex flex-row items-center gap-3 rounded-lg py-2 outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-700"
				:class="isOpen ? 'px-3' : 'px-2'"
			>
				<img src="@/assets/images/atlas-logo.svg" alt="Logo" class="h-10 w-10 shrink-0" />
				<Transition name="fade">
					<h1
						v-show="isOpen"
						class="text-3xl font-semibold text-slate-50 whitespace-nowrap"
					>
						Atlas
					</h1>
				</Transition>
			</RouterLink>
		</div>

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
		<nav class="mt-6 flex flex-1 flex-col gap-2 px-2">
			<RouterLink
				v-for="item in navbarItems"
				:key="item.label"
				:to="item.url"
				active-class="sidebar-item-active"
				class="sidebar-item flex flex-row items-center gap-3 rounded-lg py-2.5 text-slate-200 transition-colors"
				:class="[isOpen ? 'px-4' : 'justify-center px-0']"
			>
				<i :class="item.icon" class="text-lg shrink-0 w-6 text-center" />
				<Transition name="fade">
					<span v-show="isOpen" class="text-sm font-medium">{{ item.label }}</span>
				</Transition>
			</RouterLink>
		</nav>
	</aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(true);
const quickActions = ref([
	{
		label: 'Добавить сделку',
	},
	{
		label: 'Добавить актив',
	},
]);
const menu = ref();
const toggleQuickActionsMenu = (e: Event) => {
	menu.value.toggle(e);
};

const navbarItems = ref([
	{
		label: 'Портфель',
		icon: 'fa-solid fa-briefcase',
		url: '/app/portfolio',
	},
	{
		label: 'Аналитика',
		icon: 'fa-solid fa-chart-line',
		url: '/app/analytics',
	},
]);
</script>

<style scoped>
.sidebar-link {
	text-decoration: none;
}
.sidebar-link:hover {
	background-color: rgb(71 85 105);
}

.sidebar-item {
	text-decoration: none;
}
.sidebar-item:hover {
	background-color: rgb(71 85 105);
}
.sidebar-item-active {
	background-color: rgb(51 65 85);
	color: rgb(248 250 252);
}
.sidebar-item-active:hover {
	background-color: rgb(71 85 105);
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
	opacity: 1;
}
</style>
