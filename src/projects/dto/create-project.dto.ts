import { IsString, Length, MaxLength } from 'class-validator';

export class CreateProjectDto {
	@IsString()
	@Length(3, 100)
	name: string;
	@IsString()
	@MaxLength(1024)
	description: string;
}
