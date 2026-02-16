<template>
	<div class="bg-slate-900 min-h-screen">
		<div class="container mx-auto flex">
			<div class="w-2/5 bg-slate-700 text-slate-50 py-10 px-20">
				<div class="flex flex-row items-center gap-2 mt-20">
					<img src="@/assets/images/atlas-logo.svg" alt="Logo" class="w-20 h-20" />
					<span class="text-4xl font-bold whitespace-nowrap">
						Atlas
					</span>
				</div>
				<div class="mt-30">
					<h2 class="text-2xl font-bold">Рады видеть вас снова!</h2>
					<p class="text-slate-200">Введите свои данные для входа в систему</p>
					<div class="mt-10 flex flex-col gap-4">
						<InputText type="text" placeholder="Email" />
						<InputText type="password" placeholder="Password" />
						<Button>Войти</Button>
						<div class="flex flex-col">
							<p>Нет аккаунта?</p>
							<Button severity="secondary" class="mt-2" @click="registerDialog = true">Зарегистрироваться</Button>
						</div>
					</div>
				</div>
			</div>
			<div class="w-3/5 text-slate-50">banner</div>
		</div>
		<div class="text-slate-50 text-center py-4">
			footer
		</div>
		<RegisterModal :registerDialog="registerDialog" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RegisterModal from '@/features/auth/components/RegisterModal.vue';

const registerDialog = ref(false);


</script>