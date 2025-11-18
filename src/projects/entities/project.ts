import AudioFile from 'src/audiofiles/entities/audiofile.entity';
import { DiarisationEntry } from 'src/diarisation/entities/diarisation.entity';
import { SubtitleEntry } from 'src/subtitles/entities/subtitle.entity';
import ProjectVersion from './project-version';
import ProjectArray from './project-array';

export default class Project {
	id: string;
	name: string;
	description: string;
	creationTime: Date;
	editedTime: Date;
	undoUpdates: ProjectVersion[] = [];
	redoUpdates: ProjectVersion[] = [];
	audio: ProjectArray<AudioFile>;
	models: any;
	diarisation: ProjectArray<DiarisationEntry>;
	subtitles: ProjectArray<SubtitleEntry>;
	constructor() {}
}

export const DEFAULT_PROJECT: Partial<Project> = {
	audio: { index: 0, array: [] },
	diarisation: { index: 0, array: [] },
	subtitles: { index: 0, array: [] },
	undoUpdates: [],
	redoUpdates: [],
	models: {
		diarisation: {
			model: 'pyannote3.1',
		},
		recognition: {
			model: 'whisper',
		},
		separation: {
			model: 'demucs',
		},
		translation: {
			model: 'deepl',
		},
		voiceConversion: {
			model: 'chatterbox',
		},
	},
};
