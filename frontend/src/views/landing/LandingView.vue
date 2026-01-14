<template>
	<div class="bg-slate-50 min-h-screen">
		<div class="bg-slate-800">
			<div class="container mx-auto flex flex-row justify-between items-center py-2">
				<div>
					<h1 class="text-xl font-bold text-slate-50">Atlas</h1>
				</div>
				<div>
					<Button icon="pi pi-sun" rounded variant="outlined" aria-label="Filter" class="mr-4"/>
					<Button severity="secondary" class="mr-2">Войти</Button>
					<Button>Регистрация</Button>
				</div>
			</div>
		</div>
		<div>
			<div class="container mx-auto min-h-screen mt-20">
				<div class="flex justify-between">
					<div class="w-1/3">
						<h1 class="text-4xl font-bold text-slate-800">
							Присоединяйся к Atlas
						</h1>
						<p class="text-slate-500 mt-4">
							Все необходимые инструменты для учета инвестиционного дохода в одном месте.
							Анализируй свои активы, следи за котировками акций и облигаций и следуй своей стратегии.
						</p>
						<div class="mt-6">
							<Button>Присоединиться</Button>
						</div>
					</div>
					<div class="w-1/2">
						<div class="w-180 bg-slate-500 h-60 rounded-2xl"></div>
					</div>
				</div>
			</div>
		</div>
		<div>
			<div class="container mx-auto mt-20">
				<h2>Преимущества</h2>
			</div>
		</div>
		<div>
			features
		</div>
		<div>
			FAQ
		</div>
		<div>
			footer
		</div>
		<div>
			copy
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
</script>