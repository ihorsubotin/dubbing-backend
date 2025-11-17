import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UseDiarisationDto {
	@IsNumber()
	@IsOptional()
	target: number;
}
