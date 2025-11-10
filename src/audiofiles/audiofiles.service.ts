import { Injectable } from '@nestjs/common';
import { CreateAudiofileDto } from './dto/create-audiofile.dto';
import { UpdateAudiofileDto } from './dto/update-audiofile.dto';
import { ProjectsService } from 'src/projects/projects.service';
import AudioFile from './entities/audiofile.entity';
import Project from 'src/projects/entities/project';
import path from 'node:path';
import * as fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AudioFilesService {
	constructor(private projectsService: ProjectsService) {}

	async uploadFile(project: Project, file: Express.Multer.File) {
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
		await this.projectsService.updateProject(
			project,
			'appendArray',
			'audio',
			audioFile,
		);
		return audioFile;
	}

	getAudioStream(project: Project, fileName: string) {
		const audio = project.audio.find((value) => value.fileName == fileName);
		if (audio) {
			return fs.createReadStream(audio.localPath);
		} else {
			return null;
		}
	}

	findAllRaw(project: Project, name: string) {
		if(name == undefined){
			name = '';
		}
		const audios = project.audio.filter(audio=> audio.type === 'raw' && audio.name.includes(name));
		return audios;
	}

	findOne(project: Project, fileName: string) {
		const audio = project.audio.find((value) => value.fileName == fileName);
		if (audio) {
			return audio;
		} else {
			return null;
		}
	}

	async update(project: Project, fileName: string, updateAudiofileDto: UpdateAudiofileDto) {
		const audio = project.audio.find((value) => value.fileName == fileName);
		if(audio){
			await this.projectsService.updateProject(project, 'change', `audio/fileName:${fileName}`, {
				name: updateAudiofileDto.name
			});
			return audio;
		}else{
			return null;
		}
	}

	remove(id: number) {
		//TODO		
		return `This action removes a #${id} audiofile`;
	}
}
