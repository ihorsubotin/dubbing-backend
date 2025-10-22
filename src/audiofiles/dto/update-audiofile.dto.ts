import { PartialType } from '@nestjs/mapped-types';
import { CreateAudiofileDto } from './create-audiofile.dto';

export class UpdateAudiofileDto extends PartialType(CreateAudiofileDto) {}
