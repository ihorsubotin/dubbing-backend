export type AudioTypes =
	| 'raw'
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
	versionOf?: string;
}
