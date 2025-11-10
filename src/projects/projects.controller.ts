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
	Res,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { diff } from 'node:util';
import { ActiveCurrentProject } from './guard/current-project';
import { GetProject } from './decorator/get-project';
import Project from './entities/project';
import type { Response } from 'express';
import { SelectProjectDto } from './dto/select-project.dto';

@Controller('project')
export class ProjectsController {
	constructor(private readonly projectsService: ProjectsService) {}

	@Post()
	create(@Body() createProjectDto: CreateProjectDto) {
		return this.projectsService.create(createProjectDto);
	}

	@Get('all')
	findAll() {
		return this.projectsService.findAll();
	}

	@UseGuards(ActiveCurrentProject)
	@Get()
	getCurrentProject(@GetProject() project: Project) {
		return project;
	}

	@Post('select')
	async setCurrentProject(
		@Body() body: SelectProjectDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const project = await this.projectsService.findOne(body.id);
		if (project) {
			res.cookie('project-id', project.id);
			return project;
		} else {
			throw new NotFoundException(`Project ${body.id} not found`);
		}
	}

	@Get('test')
	async testProjectOpeningSpeed() {
		const projects = await this.projectsService.findAll();
		const startTime = new Date();
		for (let i = 0; i < 2000; i++) {
			for (const project of projects) {
				await this.projectsService.findOne(project.id as string);
			}
		}
		const endTime = new Date();
		const differnece = endTime.getTime() - startTime.getTime();
		return differnece;
	}

	@UseGuards(ActiveCurrentProject)
	@Patch()
	update(
		@GetProject() project: Project,
		@Body() updateProjectDto: UpdateProjectDto,
	) {
		return this.projectsService.updateProjectRoot(project, updateProjectDto);
	}

	@UseGuards(ActiveCurrentProject)
	@Post('undo')
	undo(@GetProject() project: Project) {
		return this.projectsService.applyUndo(project);
	}

	@UseGuards(ActiveCurrentProject)
	@Post('redo')
	redo(@GetProject() project: Project) {
		return this.projectsService.applyRedo(project);
	}

	@UseGuards(ActiveCurrentProject)
	@Delete()
	remove(@GetProject() project: Project) {
		return this.projectsService.remove(project);
	}
}
