<template>
	<div class="bg-slate-900 min-h-screen flex flex-row">
		<AppSidebar />
		<div class="w-full">
			<AppTopPanel />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppSidebar from '../shared/layout/AppSidebar.vue';
import AppTopPanel from '../shared/layout/AppTopPanel.vue';
</script>
