import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDiarisationDto {
	id: number;
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
