import type { RegisterRequest } from '@atlas/types';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
	MaxLength,
} from 'class-validator';

export class RegisterDto implements RegisterRequest {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
	@MaxLength(100, { message: 'Пароль не должен превышать 100 символов' })
	password: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
	@MaxLength(100, { message: 'Пароль не должен превышать 100 символов' })
	confirmPassword: string;

	@IsString({ message: 'Имя должно быть строкой' })
	@IsNotEmpty({ message: 'Имя обязательно' })
	@MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
	@MaxLength(50, { message: 'Имя не должно превышать 50 символов' })
	name: string;
}
