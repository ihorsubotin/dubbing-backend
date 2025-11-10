import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	NotFoundException,
} from '@nestjs/common';
import { ModelsService } from './models.service';
import { UpdateModelDto } from './dto/update-model.dto';
import { ActiveCurrentProject } from 'src/projects/guard/current-project';
import Project from 'src/projects/entities/project';
import { GetProject } from 'src/projects/decorator/get-project';

@Controller('models')
export class ModelsController {
	constructor(private readonly modelsService: ModelsService) {}

	@Get()
	@UseGuards(ActiveCurrentProject)
	findAll(@GetProject() project: Project) {
		return project.models;
	}

	@Get(':name')
	@UseGuards(ActiveCurrentProject)
	findOne(@GetProject() project: Project,
	@Param('name') name: string) {
		if(project.models[name]){
			return project.models[name];
		}else{
			throw new NotFoundException(`Model ${name} not found`);
		}
	}

	@Patch(':name')
	@UseGuards(ActiveCurrentProject)
	async update(
		@GetProject() project: Project, 
		@Param('name') name: string, 
		@Body() updateModelDto: UpdateModelDto
	) {
		const update = await this.modelsService.update(project, name, updateModelDto);
		if(update){
			return update;
		}else{
			throw new NotFoundException(`Unable to update model with given parameters`);
		}
	}
}
