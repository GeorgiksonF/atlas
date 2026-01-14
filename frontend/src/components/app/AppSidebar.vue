<template>
	<aside
		class="bg-slate-700 min-h-screen border-r-2 border-slate-500 transition-all duration-300 relative group"
		:class="isOpen ? 'w-64' : 'w-20'"
	>
		<div
			class="absolute top-30 right-0 z-10 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
		>
			<Button
				:icon="isOpen ? 'pi pi-arrow-right' : 'pi pi-arrow-left'"
				severity="secondary"
				rounded
				size="small"
				aria-label="sidebar-toggle"
				@click="isOpen = !isOpen"
			/>
		</div>
		<div class="flex justify-center pt-4">
			<RouterLink to="/app" class="flex flex-row items-center gap-2">
				<img src="@/public/atlas-logo.svg" alt="Logo" class="w-10 h-10" />
				<Transition name="fade">
					<h1 class="text-2xl font-bold text-slate-50 whitespace-nowrap" v-show="isOpen">
						Atlas
					</h1>
				</Transition>
			</RouterLink>
		</div>
		<div class="flex flex-col items-center justify-center mt-4">
			<Button class="w-2/3 flex flex-row items-center gap-2" @click="toggleQuickActionsMenu">
				<i class="pi pi-plus" :class="[isOpen ? 'mr-5' : 'mr-0']" />
				<Transition name="fade">
					<span v-show="isOpen">Действия</span>
				</Transition>
			</Button>
			<Menu ref="menu" id="actions-menu" :model="quickActions" :popup="true" />
		</div>
		<ul class="mt-8 flex flex-col items-center justify-center">
			<li v-for="item in navbarItems" :key="item.label">
				<RouterLink
					:to="item.url"
					class="flex flex-row items-center gap-6 mt-2 text-slate-100 hover:bg-slate-600 rounded-md"
					:class="isOpen ? 'px-8 py-2' : 'px-2 py-2 justify-center w-14'"
				>
					<i :class="item.icon" class="text-l" />
					<Transition name="fade">
						<span v-show="isOpen">{{ item.label }}</span>
					</Transition>
				</RouterLink>
			</li>
		</ul>
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
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease, transform 0.3s ease;
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
