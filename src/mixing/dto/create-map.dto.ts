import { IsNumber } from 'class-validator';

export class CreateAudioMapDto {
	@IsNumber()
	fromAudio: number;
	@IsNumber()
	fromStartTime: number;
	@IsNumber()
	fromEndTime: number;
	@IsNumber()
	toAudio: number;
	@IsNumber()
	toStartTime: number;
}
