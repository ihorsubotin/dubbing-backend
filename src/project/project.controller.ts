import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { diff } from 'node:util';

@Controller('project')
export class ProjectController {
	constructor(
		private readonly projectService: ProjectService,
	) {}

	@Post()
	create(@Body() createProjectDto: CreateProjectDto) {
		return this.projectService.create(createProjectDto);
	}

	@Get('all')
	findAll() {
		return this.projectService.findAll();
	}

	@Get()
	async getCurrent() {
		const projects = await this.projectService.findAll();
		const startTime = new Date();
		for(let i = 0; i < 2000; i++){
			for(const project of projects){
				await this.projectService.findOne(project.id as string);
			}
		}
		const endTime = new Date();
		const differnece = endTime.getTime() - startTime.getTime();
		return differnece; 
		//return this.projectService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
		//return this.projectService.update(+id, updateProjectDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.projectService.remove(+id);
	}
}
