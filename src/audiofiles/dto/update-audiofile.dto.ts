import { PartialType } from '@nestjs/mapped-types';
import { CreateAudiofileDto } from './create-audiofile.dto';
import { IsString, Length } from 'class-validator';

export class UpdateAudiofileDto {
	@IsString()
	@Length(3, 200)
	name: string;
}
