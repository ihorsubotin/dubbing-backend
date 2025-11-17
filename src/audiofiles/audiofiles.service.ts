import { Injectable } from '@nestjs/common';
import { ProjectsService } from 'src/projects/projects.service';
import AudioFile from './entities/audiofile.entity';
import path from 'node:path';
import * as fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import CompositionAudio from './entities/composition-audio.entity';
import { GenericCrudService } from 'src/projects/generic-crud.service';

@Injectable()
export class AudioFilesService extends GenericCrudService<AudioFile> {
	constructor(protected projectsService: ProjectsService) {
		super('audio', projectsService);
	}

	async uploadFile(file: Express.Multer.File) {
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
		audioFile.type = 'raw';
		await this.createOne(audioFile);
		return audioFile;
	}

	getAudioStream(fileName: string) {
		const audio = this.findByFileName(fileName);
		if (audio) {
			return fs.createReadStream(audio.localPath);
		} else {
			return undefined;
		}
	}

	findAllRaw(name: string) {
		const audio = this.findAll();
		if (name == undefined) {
			name = '';
		}
		return audio.filter(
			(audio) => audio.type === 'raw' && audio.name.includes(name),
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

	findComposition(fileName: string) {
		const composition = new CompositionAudio();
		const audio = this.findAll();
		composition.raw = audio.find((value) => value.fileName == fileName);
		composition.voiceonly = audio.find(
			(value) => value.versionOf == fileName && value.type == 'voiceonly',
		);
		composition.backgroundonly = audio.find(
			(value) => value.versionOf == fileName && value.type == 'backgroundonly',
		);
		composition.output = audio.find(
			(value) => value.versionOf == fileName && value.type == 'output',
		);
		return composition;
	}

	remove(id: number) {
		//TODO
		return `This action removes a #${id} audiofile`;
	}
}
