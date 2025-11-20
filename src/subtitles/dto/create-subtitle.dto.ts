import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSubtitleDto {
	@IsNumber()
	forAudio: number;
	@IsString()
	text: string;
	@IsString()
	@MaxLength(10)
	language: string;
	@IsNumber()
	startTime: number;
	@IsNumber()
	endTime: number;
	@IsOptional()
	@IsNumber()
	translationOf?: number;
}
