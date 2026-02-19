import { z } from 'zod';
import { validation as msg } from '../constants/messages';
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from '../constants/validation';

export const loginSchema = z.object({
	email: z
		.string({ required_error: msg.email.required })
		.trim()
		.email(msg.email.invalid),
	password: z
		.string({ required_error: msg.password.required })
		.min(PASSWORD_MIN_LENGTH, msg.password.min)
		.max(PASSWORD_MAX_LENGTH, msg.password.max),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
