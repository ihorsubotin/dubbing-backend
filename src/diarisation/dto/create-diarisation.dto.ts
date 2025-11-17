import { IsNumber, IsString } from 'class-validator';

export default class CreateDiarisationDto {
	@IsNumber()
	forAudio: number;
	@IsString()
	speaker: string;
	@IsNumber()
	startTime: number;
	@IsNumber()
	endTime: number;
}
