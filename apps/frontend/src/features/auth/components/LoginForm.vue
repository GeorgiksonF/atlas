<template>
	<div class="mt-10 flex flex-col gap-4">
		<form
			id="login-form"
			class="flex flex-col gap-4"
			@submit="onSubmit"
		>
			<div class="flex flex-col gap-1 w-full">
				<InputGroup class="w-full">
					<InputGroupAddon>
						<i class="pi pi-envelope" />
					</InputGroupAddon>
					<FloatLabel class="block w-full flex-1" variant="on">
						<InputText
							id="login-email"
							type="email"
							class="w-full"
							v-model="emailValue"
							:invalid="!!emailError"
							@blur="emailBlur"
						/>
						<label for="login-email">Email</label>
					</FloatLabel>
				</InputGroup>
				<Message v-if="emailError" severity="error" class="w-full" variant="simple">{{
					emailErrorText
				}}</Message>
			</div>
			<div class="flex flex-col gap-1 w-full">
				<InputGroup class="w-full">
					<InputGroupAddon>
						<i class="pi pi-lock" />
					</InputGroupAddon>
					<FloatLabel class="block w-full flex-1" variant="on">
						<Password
							input-id="login-password"
							v-model="passwordValue"
							:invalid="!!passwordError"
							:feedback="false"
							toggle-mask
							fluid
							@blur="passwordBlur"
						/>
						<label for="login-password">Пароль</label>
					</FloatLabel>
				</InputGroup>
				<Message v-if="passwordError" severity="error" class="w-full" variant="simple">{{
					passwordErrorText
				}}</Message>
			</div>
			<Message v-if="submitError" severity="error" class="w-full" variant="simple">{{
				submitError
			}}</Message>
			<Button type="submit" :loading="loading" :disabled="loading">
				Войти
			</Button>
		</form>
		<div class="flex flex-col">
			<p>Нет аккаунта?</p>
			<Button severity="secondary" class="mt-2" type="button" @click="emit('open-register')">
				Зарегистрироваться
			</Button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useToast } from 'primevue/usetoast';
import { getErrorMessage } from '@/shared/api/errorMessage';
import { authRepository } from '../api/authRepository';
import { useAuthStore } from '../stores/authStore';
import { login } from '../constants/messages';
import { loginSchema, type LoginFormValues } from '../schemas/loginSchema';

const toast = useToast();
const emit = defineEmits<{ 'open-register': [] }>();

const { handleSubmit } = useForm({
	validationSchema: toTypedSchema(loginSchema),
	initialValues: { email: '', password: '' },
});

const { value: emailValue, errorMessage: emailError, handleBlur: emailBlur } =
	useField<LoginFormValues['email']>('email');
const { value: passwordValue, errorMessage: passwordError, handleBlur: passwordBlur } =
	useField<LoginFormValues['password']>('password');

const emailErrorText = computed(() => String(emailError.value ?? ''));
const passwordErrorText = computed(() => String(passwordError.value ?? ''));

const submitError = ref('');
const loading = ref(false);
const authStore = useAuthStore();

const onSubmit = handleSubmit(onLogin);

async function onLogin(values: LoginFormValues): Promise<void> {
	submitError.value = '';
	loading.value = true;
	try {
		const response = await authRepository.login(values);
		authStore.setToken(response.access_token);
		authStore.setUser(response.user);
		toast.add({
			severity: 'success',
			summary: login.toastSuccessSummary,
			detail: login.toastSuccessDetail,
			life: 3000,
		});
	} catch (err: unknown) {
		const errorText = getErrorMessage(err, login.errorFallback);
		submitError.value = errorText;
		toast.add({
			severity: 'error',
			summary: login.toastErrorSummary,
			detail: errorText,
			life: 5000,
		});
	} finally {
		loading.value = false;
	}
}
</script>
