import { Injectable } from '@nestjs/common';
import { UpdateModelDto } from './dto/update-model.dto';
import Project from 'src/projects/entities/project';
import { DEFAULT_PROJECT, ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class ModelsService {
	constructor(private projectsService: ProjectsService){}
	findOne(project: Project, modelName: string) {
		if (project.models[modelName]){
			return project.models[modelName];
		}else{
			return DEFAULT_PROJECT.models[modelName];
		}
	}

	async update(project: Project, modelName: string, updateModelDto: UpdateModelDto) {
		switch(modelName){
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
		if(updateModelDto == undefined || updateModelDto == null){
			return false;
		}
		await this.projectsService.updateProject(project, 'change', `models/${modelName}`, updateModelDto);
		return project.models[modelName];
	}
}
