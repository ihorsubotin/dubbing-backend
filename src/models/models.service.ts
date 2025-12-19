import { Injectable } from '@nestjs/common';
import { UpdateModelDto } from './dto/update-model.dto';
import { ProjectsService } from 'src/projects/projects.service';
import { DEFAULT_PROJECT } from 'src/projects/entities/project';
import RabbitMQService from './rabbitmq.service';
import AudioFile from 'src/audiofiles/entities/audiofile.entity';
import { AudioMap } from 'src/mixing/entities/audio-map.entity';
import CompositionAudio from 'src/audiofiles/entities/composition-audio.entity';
import { DiarisationEntry } from 'src/diarisation/entities/diarisation.entity';

@Injectable()
export class ModelsService {
	constructor(
		private projectsService: ProjectsService,
		private rabitMQService: RabbitMQService
	) {}
	findAll() {
		return this.projectsService.getProject().models;
	}

	findOne(modelName: string) {
		const project = this.projectsService.getProject();
		if (project.models[modelName]) {
			return project.models[modelName];
		} else {
			return DEFAULT_PROJECT.models[modelName];
		}
	}

	async update(modelName: string, updateModelDto: UpdateModelDto) {
		switch (modelName) {
			case 'diarisation':
				break;
			case 'recognition':
				break;
			case 'separation':
				break;
			case 'translation':
				break;
			case 'voiceConversion':
				break;
			case 'render':
				break;
			default:
				return false;
		}
		if (updateModelDto == undefined || updateModelDto == null) {
			return false;
		}
		await this.projectsService.updateCurrentProject(
			'change',
			`models/${modelName}`,
			updateModelDto,
			`Updating ${modelName} model`,
		);
		return this.projectsService.getProject().models[modelName];
	}
	
	async sendSeparationRequest(composition: CompositionAudio){
		this.rabitMQService.emitSeparationRequest('separate', {
			project: this.projectsService.getProject().id,
			fileName: composition.wav?.fileName,
			toVoiceonly: composition.voiceonly?.id,
			toBackgroundonly: composition.backgroundonly?.id
		});
	}

	async sendDiarisationRequest(audioFiles: Partial<AudioFile>[]){
		this.rabitMQService.emitDiarisationRequest('diarisation', {
			project: this.projectsService.getProject().id,
			files: audioFiles
		});
	}
	
	async sendSubtitlesRequest(audioFiles: Partial<AudioFile>[]){
		this.rabitMQService.emitRecognitionRequest('subtitles', {
			project: this.projectsService.getProject().id,
			files: audioFiles
		});
	}

	async sendFormatConvertionRequest(audio: AudioFile){
		this.rabitMQService.emitMediaRequest('convert', {
			project: this.projectsService.getProject().id,
			fileName: audio.fileName,
			id: audio.id
		});
	}

	async sendVoiceConvertionRequest(audioFiles:Partial<AudioFile>[], diarisations: DiarisationEntry[]){
		this.rabitMQService.emitConversionRequest('convert', {
			project: this.projectsService.getProject().id,
			aduio: audioFiles,
			diarisations: diarisations
		});
	}

	sendRenderRequest(mappings: AudioMap[], outputId: number){
		this.rabitMQService.emitMediaRequest('render', {
			project: this.projectsService.getProject().id,
			mappings: mappings,
			format: this.findOne('render').format,
			outputId: outputId
		});
	}
}
