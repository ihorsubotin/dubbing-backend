export class SubtitleEntry {
	id: number;
	forAudio: number;
	translationOf?: number;
	text: string;
	language: string;
	startTime: number;
	endTime: number;
}
