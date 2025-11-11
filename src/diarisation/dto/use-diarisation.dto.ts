import { IsOptional, IsString } from 'class-validator';

export class UseDiarisationDto {
	@IsString()
	@IsOptional()
	target: string;
}
