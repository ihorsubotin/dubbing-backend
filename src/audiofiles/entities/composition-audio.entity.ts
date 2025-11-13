import AudioFile from './audiofile.entity';

export default class CompositionAudio {
	raw?: AudioFile;
	voiceonly?: AudioFile;
	backgroundonly?: AudioFile;
	output?: AudioFile;
}
