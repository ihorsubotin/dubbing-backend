import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateModelDto {
	@IsOptional()
	@IsString()
	@Length(3, 25)
	model: string;
}
