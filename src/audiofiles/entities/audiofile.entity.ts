export type AudioTypes = 'raw' | 'collection' | 'dubbed';
export default class AudioFile {
	fileName: string;
	localPath: string;
	name: string;
	size: number;
	uploadTime?: Date;
	type: AudioTypes;
}
