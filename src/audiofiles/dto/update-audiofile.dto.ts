import { IsString, Length } from 'class-validator';

export class UpdateAudiofileDto {
	@IsString()
	@Length(3, 200)
	name: string;
}
