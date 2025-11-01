import { Injectable } from '@nestjs/common';
import { CreateAudiofileDto } from './dto/create-audiofile.dto';
import { UpdateAudiofileDto } from './dto/update-audiofile.dto';
import { ProjectService } from 'src/project/project.service';
import AudioFile from './entities/audiofile.entity';
import Project from 'src/project/entities/project';
import path from 'node:path';
import * as fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AudioFilesService {
	constructor(private projectService: ProjectService) {}

	async uploadFile(project: Project, file: Express.Multer.File) {
		const audioFile = new AudioFile();
		const audioDir = path.join(
			this.projectService.rootPath,
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
		await this.projectService.updateProject(
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

	create(createAudiofileDto: CreateAudiofileDto) {
		return 'This action adds a new audiofile';
	}

	findAll() {
		return `This action returns all audiofiles`;
	}

	findOne(id: number) {
		return `This action returns a #${id} audiofile`;
	}

	update(id: number, updateAudiofileDto: UpdateAudiofileDto) {
		return `This action updates a #${id} audiofile`;
	}

	remove(id: number) {
		return `This action removes a #${id} audiofile`;
	}
}
