import { IsString, Length } from 'class-validator';

export class SelectProjectDto {
	@IsString()
	@Length(36, 36)
	id: string;
}
