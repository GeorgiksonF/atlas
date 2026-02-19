import { z } from 'zod';
import { validation as msg } from '../constants/messages';
import {
	NAME_MIN_LENGTH,
	NAME_MAX_LENGTH,
	PASSWORD_MIN_LENGTH,
	PASSWORD_MAX_LENGTH,
} from '../constants/validation';

export const registerSchema = z
	.object({
		name: z
			.string({ required_error: msg.name.required })
			.trim()
			.min(NAME_MIN_LENGTH, msg.name.min)
			.max(NAME_MAX_LENGTH, msg.name.max),
		email: z
			.string({ required_error: msg.email.required })
			.trim()
			.email(msg.email.invalid),
		password: z
			.string({ required_error: msg.password.required })
			.min(PASSWORD_MIN_LENGTH, msg.password.min)
			.max(PASSWORD_MAX_LENGTH, msg.password.max),
		confirmPassword: z.string({ required_error: msg.confirmPassword.required }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: msg.confirmPassword.mismatch,
		path: ['confirmPassword'],
	});

export type RegisterFormValues = z.infer<typeof registerSchema>;
