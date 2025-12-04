import AudioFile from './audiofile.entity';

export default class CompositionAudio {
	raw?: AudioFile;
	converted?: AudioFile;
	wav?: AudioFile;
	voiceonly?: AudioFile;
	backgroundonly?: AudioFile;
	output?: AudioFile;
}
