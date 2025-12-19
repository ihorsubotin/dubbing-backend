import { IsArray, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export default class UseConversionDto{
	@IsInt()
	referenceAudio: number;
	@IsString()
	speaker: string;
	@IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	coversionAudios: number[];
}