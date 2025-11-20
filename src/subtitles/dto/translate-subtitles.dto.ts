import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export default class TranslateSubtitlesDto {
	@IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	forAudio: number[];
	@IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	forSubtitle: number[];
	@IsString()
	language: string;
}
