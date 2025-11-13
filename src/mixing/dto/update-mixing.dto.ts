import { PartialType } from '@nestjs/mapped-types';
import { CreateMixingDto } from './create-mixing.dto';

export class UpdateMixingDto extends PartialType(CreateMixingDto) {}
