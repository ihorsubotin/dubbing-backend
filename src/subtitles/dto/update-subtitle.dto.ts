import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSubtitleDto } from './create-subtitle.dto';

export class UpdateSubtitleDto extends  PartialType(OmitType(CreateSubtitleDto, ['forAudio', 'translationOf'])) {

}
