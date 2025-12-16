import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import type { TargetLanguageCode } from 'deepl-node';

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
	language: TargetLanguageCode;
}
