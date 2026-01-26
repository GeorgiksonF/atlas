import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
	@IsEmail({}, { message: 'Email должен быть валидным адресом' })
	email: string;

	@IsString({ message: 'Пароль должен быть строкой' })
	@MinLength(1, { message: 'Пароль обязателен' })
	password: string;
}
