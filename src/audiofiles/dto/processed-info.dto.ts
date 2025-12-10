import { Transform } from "class-transformer";
import { IsNumber, IsNumberString, IsOptional } from "class-validator";

export default class ProcessedInfoDto{
	@IsOptional()
	@Transform(({ value }) => parseFloat(value))
	@IsNumber()
	duration: number;
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	@IsNumber()
	samplingRate: number;
}