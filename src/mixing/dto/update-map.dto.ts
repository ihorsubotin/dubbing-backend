import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAudioMapDto } from './create-map.dto';

export class UpdateAudioMapDto extends PartialType(
	OmitType(CreateAudioMapDto, ['fromAudio', 'toAudio']),
) {}
