import { IsArray, IsNumber, IsOptional } from "class-validator";

export default class GenerateSubtitlesDto{
	@IsOptional()
	@IsArray()
	@IsNumber({}, {each: true})
	forAudio: number[];
}