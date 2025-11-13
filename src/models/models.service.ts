import { Injectable } from '@nestjs/common';
import { UpdateModelDto } from './dto/update-model.dto';
import { ProjectsService } from 'src/projects/projects.service';
import { DEFAULT_PROJECT } from 'src/projects/entities/project';

@Injectable()
export class ModelsService {
	constructor(private projectsService: ProjectsService) {}
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
}
