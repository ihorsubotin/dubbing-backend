import AudioFile from 'src/audiofiles/entities/audiofile.entity';
import ProjectUpdate from './project-update';

export default class Project {
	id: string;
	name: string;
	description: string;
	creationTime: Date;
	editedTime: Date;
	undoUpdates: ProjectUpdate[] = [];
	redoUpdates: ProjectUpdate[] = [];
	audio: AudioFile[];
}
