import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateDiarisationDto {
	@IsOptional()
	@IsString()
	speaker: string;
	@IsOptional()
	@IsNumber()
	startTime: number;
	@IsOptional()
	@IsNumber()
	endTime: number;
}
