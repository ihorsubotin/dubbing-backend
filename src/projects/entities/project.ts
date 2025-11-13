import AudioFile from 'src/audiofiles/entities/audiofile.entity';
import ProjectUpdate from './project-update';
import { DiarisationEntry } from 'src/diarisation/entities/diarisation.entity';
import { SubtitlesEntry } from 'src/subtitles/entities/subtitle.entity';
import ProjectVersion from './project-version';

export default class Project {
	id: string;
	name: string;
	description: string;
	creationTime: Date;
	editedTime: Date;
	undoUpdates: ProjectVersion[] = [];
	redoUpdates: ProjectVersion[] = [];
	audio: AudioFile[];
	models: any;
	diarisation: DiarisationEntry[];
	subtitles: SubtitlesEntry[];
}

export const DEFAULT_PROJECT: Partial<Project> = {
	audio: [],
	diarisation: [],
	subtitles: [],
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
