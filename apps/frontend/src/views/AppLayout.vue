<template>
	<div class="bg-slate-900 min-h-screen flex flex-row">
		<AppSidebar />

		<div class="flex-1 flex flex-col min-w-0">
			<AppTopPanel />

			<div class="flex-1 relative overflow-hidden">
				<main id="main-content" class="h-full w-full p-4 text-slate-300">
					<router-view />
				</main>
				<PortfolioSidebar  />
			</div>
		</div>

		<AppGlobalModals />
	</div>
</template>

<script setup lang="ts">
import { AppGlobalModals, AppSidebar, AppTopPanel,  } from '@layout';
import { PortfolioSidebar } from '@widgets/portfolios';
</script>
