export type AudioTypes =
	| 'raw'
	| 'wav'
	| 'voiceonly'
	| 'backgroundonly'
	| 'collection'
	| 'dubbed'
	| 'converted'
	| 'output';
export default class AudioFile {
	id: number;
	fileName: string;
	localPath: string;
	name: string;
	size: number;
	uploadTime?: Date;
	type: AudioTypes;
	versionOf?: number;
	duration?: number;
	samplingRate?: number;
	processed?: boolean;
	errorMessage?: string;
}
