import { Inject, Injectable } from '@nestjs/common';
import { ProjectsService } from 'src/projects/projects.service';
import AudioFile, { AudioTypes } from './entities/audiofile.entity';
import path from 'node:path';
import * as fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import CompositionAudio from './entities/composition-audio.entity';
import { GenericCrudService } from 'src/projects/generic-crud.service';
import { ModelsService } from 'src/models/models.service';
import ProcessedInfoDto from './dto/processed-info.dto';

@Injectable()
export class AudioFilesService extends GenericCrudService<AudioFile> {
	constructor(
		protected projectsService: ProjectsService,
		private modelsService: ModelsService
	) {
		super('audio', projectsService);
	}

	async uploadFile(file: Express.Multer.File){
		const project = this.projectsService.getProject();
		const audioFile = new AudioFile();
		const audioDir = path.join(
			this.projectsService.rootPath,
			project.id,
			'audio',
		);
		await fs.promises.access(audioDir).catch(async (err) => {
			await fs.promises.mkdir(audioDir);
		});
		const newFile = `${uuidv4()}${path.parse(file.originalname).ext}`;
		const filePath = path.join(audioDir, newFile);
		await fs.promises.writeFile(filePath, file.buffer);
		audioFile.fileName = newFile;
		audioFile.localPath = filePath;
		audioFile.name = path.parse(file.originalname).name;
		audioFile.uploadTime = new Date();
		audioFile.size = file.size;
		return audioFile;
	}

	async loadNewFile(file: Express.Multer.File, type: AudioTypes = 'raw') {
		const audioFile = await this.uploadFile(file);
		audioFile.type = type;
		audioFile.processed = false;
		await this.createOne(audioFile);
		this.modelsService.sendFormatConvertionRequest(audioFile);
		return audioFile;
	}

	async uploadConvertedVersion(id: number, file: Express.Multer.File, processedInfo: ProcessedInfoDto){
		const update: Partial<AudioFile> = {
			processed: true,
			...processedInfo
		}
		await this.updateOne(id, update, undefined, true);
		const audioFile = await this.uploadFile(file);
		audioFile.duration = processedInfo.duration;
		audioFile.samplingRate = processedInfo.samplingRate;
		audioFile.versionOf = id;
		audioFile.processed = true;
		audioFile.type = 'wav';
		await this.createOne(audioFile, undefined, true);
		this.createSeparation(id);
	}

	async createSeparation(id: number){
		const composition = this.findComposition(id);
		let raw = composition.raw;
		let voiceonly = composition.voiceonly;
		let backgroundonly = composition.backgroundonly;
		if(!voiceonly || !backgroundonly){
			const newVoiceonly = new AudioFile();
			newVoiceonly.duration = raw?.duration;
			newVoiceonly.samplingRate = raw?.samplingRate;
			newVoiceonly.versionOf = raw?.id;
			newVoiceonly.processed = false;
			newVoiceonly.uploadTime = new Date();
			const newBackgroundonly = new AudioFile();
			Object.assign(newBackgroundonly, newVoiceonly);
			newVoiceonly.type = 'voiceonly';
			newBackgroundonly.type = 'backgroundonly';
			await this.createArray([newVoiceonly, newBackgroundonly], 'Creating new separation');
			if(backgroundonly){
				await this.removeOne(backgroundonly.id, undefined, true);
			}
			if(voiceonly){
				await this.removeOne(voiceonly.id, undefined, true);
			}
			voiceonly = newVoiceonly;
			backgroundonly = newBackgroundonly;
		}else{
			const timeDiff = Date.now() - (voiceonly.uploadTime?.valueOf() || 0);
			if(voiceonly.processed === false && timeDiff < 5*60*1000){
				return;
			}
			if(backgroundonly.processed === false && timeDiff < 5*60*1000){
				return;
			}
			const update: Partial<AudioFile> = {
				processed: false,
				uploadTime: new Date()
			}
			await this.updateOne(voiceonly.id, update, 'Updating audio separation');
			await this.updateOne(backgroundonly.id, update, undefined, true);
		}
		const updatedComposition = this.findComposition(id);
		this.modelsService.sendSeparationRequest(updatedComposition);
		return updatedComposition;
	}

	async uploadActualFile(id: number, file: Express.Multer.File, processedInfo?: ProcessedInfoDto){
		const audioFile = await this.uploadFile(file);
		const {name, ...update} = {
			...audioFile,
			...processedInfo
		}
		Object.keys(update).forEach(key => {
			if (update[key] === undefined) {
				delete update[key];
			}
		});
		await this.updateOne(id, update, undefined, true);
	}

	getAudioStream(fileName: string) {
		const audio = this.findByFileName(fileName);
		if (audio) {
			return fs.createReadStream(audio.localPath);
		} else {
			return undefined;
		}
	}

	search(name: string, type: AudioTypes = 'raw') {
		const audio = this.findAll();
		if (name == undefined) {
			name = '';
		}
		return audio.filter(
			(audio) => audio.type === type && audio.name.includes(name),
		);
	}

	findByFileName(fileName: string) {
		const audio = this.findAll().find((value) => value.fileName == fileName);
		if (audio) {
			return audio;
		} else {
			return null;
		}
	}

	findComposition(id: number) {
		const composition = new CompositionAudio();
		const audio = this.findAll();
		composition.raw = audio.find((value) => value.id == id);
		composition.converted = audio.find(
			(value) => value.versionOf == id && value.type == 'converted',
		);
		composition.wav = audio.find(
			(value) => value.versionOf == id && value.type == 'wav',
		);
		composition.voiceonly = audio.find(
			(value) => value.versionOf == id && value.type == 'voiceonly',
		);
		composition.backgroundonly = audio.find(
			(value) => value.versionOf == id && value.type == 'backgroundonly',
		);
		composition.output = audio.find(
			(value) => value.versionOf == id && value.type == 'output',
		);
		return composition;
	}

	findConverted(id: number) {
		return this.findAll().find(
			(audio) => audio.type == 'converted' && audio.versionOf == id,
		);
	}

	findOutputFor(id: number) {
		return this.findAll().filter(
			(audio) => audio.type == 'output' && audio.versionOf == id,
		);
	}

	remove(id: number) {
		//TODO
		return `This action removes a #${id} audiofile`;
	}
}
