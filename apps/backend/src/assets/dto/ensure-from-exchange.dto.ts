import { IsNotEmpty, IsString } from 'class-validator';

export class EnsureFromExchangeDto {
	@IsString()
	@IsNotEmpty()
	ticker: string;
}
