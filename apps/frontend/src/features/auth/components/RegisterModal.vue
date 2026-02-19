<template>
	<Dialog v-model:visible="isOpen" class="w-1/5" modal @after-hide="resetForm">
		<template #header>
			<h2>Регистрация</h2>
		</template>
		<form id="register-form" class="flex flex-col gap-4 w-full pt-4" @submit.prevent="onSubmit">
			<div class="flex flex-col gap-1 w-full">
				<InputGroup class="w-full">
					<InputGroupAddon>
						<i class="pi pi-user" />
					</InputGroupAddon>
					<FloatLabel class="block w-full flex-1" variant="on">
						<InputText
							id="register-name"
							type="text"
							class="w-full"
							v-model="nameValue"
							:invalid="!!nameError"
							@blur="nameBlur"
						/>
						<label for="register-name">Имя</label>
					</FloatLabel>
				</InputGroup>
				<Message v-if="nameError" severity="error" class="w-full" variant="simple">{{
					nameErrorText
				}}</Message>
			</div>
			<div class="flex flex-col gap-1 w-full">
				<InputGroup class="w-full">
					<InputGroupAddon>
						<i class="pi pi-envelope" />
					</InputGroupAddon>
					<FloatLabel class="block w-full flex-1" variant="on">
						<InputText
							id="register-email"
							type="email"
							class="w-full"
							v-model="emailValue"
							:invalid="!!emailError"
							@blur="emailBlur"
						/>
						<label for="register-email">Email</label>
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
							input-id="register-password"
							v-model="passwordValue"
							:invalid="!!passwordError"
							:feedback="false"
							toggle-mask
							fluid
							@blur="passwordBlur"
						/>
						<label for="register-password">Пароль</label>
					</FloatLabel>
				</InputGroup>
				<Message v-if="passwordError" severity="error" class="w-full" variant="simple">{{
					passwordErrorText
				}}</Message>
			</div>
			<div class="flex flex-col gap-1 w-full">
				<InputGroup class="w-full">
					<InputGroupAddon>
						<i class="pi pi-key" />
					</InputGroupAddon>
					<FloatLabel class="block w-full flex-1" variant="on">
						<Password
							input-id="register-confirmPassword"
							v-model="confirmPasswordValue"
							:invalid="!!confirmPasswordError"
							:feedback="false"
							toggle-mask
							fluid
							@blur="confirmPasswordBlur"
						/>
						<label for="register-confirmPassword">Подтвердите пароль</label>
					</FloatLabel>
				</InputGroup>
				<Message
					v-if="confirmPasswordError"
					severity="error"
					class="w-full"
					variant="simple"
					>{{ confirmPasswordErrorText }}</Message
				>
			</div>
			<Message v-if="submitError" severity="error" class="w-full" variant="simple">{{
				submitError
			}}</Message>
		</form>
		<template #footer>
			<Button type="submit" :loading="loading" :disabled="loading" form="register-form">
				Зарегистрироваться
			</Button>
			<Button type="button" severity="secondary" :disabled="loading" @click="close">
				Отмена
			</Button>
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useToast } from 'primevue/usetoast';
import { getErrorMessage } from '@/shared/api/errorMessage';
import { authRepository } from '../api/authRepository';
import { useAuthStore } from '../stores/authStore';
import { register } from '../constants/messages';
import { registerSchema, type RegisterFormValues } from '../schemas/registerSchema';

const toast = useToast();

const props = defineProps<{
	registerDialog: boolean;
}>();

const emit = defineEmits<{
	'update:registerDialog': [value: boolean];
}>();

const isOpen = ref(props.registerDialog);
watch(
	() => props.registerDialog,
	(v) => {
		isOpen.value = v;
		if (!v) resetForm();
	},
);
watch(isOpen, (v) => {
	emit('update:registerDialog', v);
});

const { handleSubmit, resetForm: resetFormState } = useForm({
	validationSchema: toTypedSchema(registerSchema),
	initialValues: {
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	},
});

const {
	value: nameValue,
	errorMessage: nameError,
	handleBlur: nameBlur,
} = useField<RegisterFormValues['name']>('name');
const {
	value: emailValue,
	errorMessage: emailError,
	handleBlur: emailBlur,
} = useField<RegisterFormValues['email']>('email');
const {
	value: passwordValue,
	errorMessage: passwordError,
	handleBlur: passwordBlur,
} = useField<RegisterFormValues['password']>('password');
const {
	value: confirmPasswordValue,
	errorMessage: confirmPasswordError,
	handleBlur: confirmPasswordBlur,
} = useField<RegisterFormValues['confirmPassword']>('confirmPassword');

const nameErrorText = computed(() => String(nameError.value ?? ''));
const emailErrorText = computed(() => String(emailError.value ?? ''));
const passwordErrorText = computed(() => String(passwordError.value ?? ''));
const confirmPasswordErrorText = computed(() => String(confirmPasswordError.value ?? ''));

const submitError = ref('');
const loading = ref(false);
const authStore = useAuthStore();

function resetForm(): void {
	resetFormState();
	submitError.value = '';
}

function close(): void {
	isOpen.value = false;
}

const onSubmit = handleSubmit(onRegister);

async function onRegister(values: {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}): Promise<void> {
	submitError.value = '';
	loading.value = true;
	try {
		const response = await authRepository.register(values);
		authStore.setToken(response.token);
		authStore.setUser(response.user);
		toast.add({
			severity: 'success',
			summary: register.toastSuccessSummary,
			detail: register.toastSuccessDetail,
			life: 3000,
		});
		close();
	} catch (err: unknown) {
		const errorText = getErrorMessage(err, register.errorFallback);
		submitError.value = errorText;
		toast.add({
			severity: 'error',
			summary: register.toastErrorSummary,
			detail: errorText,
			life: 5000,
		});
	} finally {
		loading.value = false;
	}
}
</script>
