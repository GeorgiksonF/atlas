<template>
	<Dialog :visible="isOpen" class="w-1/5">
		<template #header>
			<h2>Регистрация</h2>
		</template>
		<div class="flex flex-col gap-4">
			<InputText type="text" placeholder="Имя" v-model="form.name" />
			<InputText type="text" placeholder="Email" v-model="form.email" />
			<InputText type="password" placeholder="Password" v-model="form.password" />
			<InputText type="password" placeholder="Confirm Password" v-model="form.confirmPassword" />
		</div>
		<template #footer>
			<Button @click="register">Зарегистрироваться</Button>
			<Button severity="secondary" @click="isOpen = false">Отмена</Button>
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import type { RegisterRequest } from '@atlas/types';
import { computed, ref } from 'vue';
import { authRepository } from '../api/authRepository';
import { useAuthStore } from '../stores/authStore';

const props = defineProps<{
	registerDialog: boolean;
}>();

const emit = defineEmits<{
	'update:registerDialog': [value: boolean];
}>();

const isOpen = computed({
	get: () => props.registerDialog,
	set: (value) => emit('update:registerDialog', value),
});

const form = ref<RegisterRequest>({
	name: '',
	email: '',
	password: '',
	confirmPassword: '',
});

const authStore = useAuthStore();

const register = async () => {
	try {
		const response = await authRepository.register(form.value);
		authStore.setToken(response.token);
		authStore.setUser(response.user);
		isOpen.value = false;
	} catch (error) {
		console.error('Ошибка регистрации:', error);
	}
};
</script>