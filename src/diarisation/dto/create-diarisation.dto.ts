import { IsNumber, IsString } from 'class-validator';

export default class CreateDiarisationDto {
	@IsString()
	fileName: string;
	@IsString()
	speaker: string;
	@IsNumber()
	startTime: number;
	@IsNumber()
	endTime: number;
}
