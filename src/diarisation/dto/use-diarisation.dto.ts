import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UseDiarisationDto {
	@IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	forAudio: number[];
}
