import { Transform } from "class-transformer";
import { IsNumber, IsNumberString, IsOptional } from "class-validator";

export default class ProcessedInfoDto{
	@Transform(({ value }) => parseFloat(value))
	@IsNumber()
	duration: number;
	@Transform(({ value }) => parseInt(value))
	@IsNumber()
	samplingRate: number;
}