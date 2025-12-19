import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Delete,
	UseGuards,
	NotFoundException,
	Res,
	BadRequestException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ActiveCurrentProject } from './guard/current-project';
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
	getCurrentProject() {
		return this.projectsService.getProject();
	}

	@Post('select')
	async setCurrentProject(
		@Body() body: SelectProjectDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const project = await this.projectsService.findOne(body.id);
		if (project) {
			res.cookie('project-id', project.id, {sameSite: "none", secure: true});
			return project;
		} else {
			throw new NotFoundException(`Project ${body.id} not found`);
		}
	}

	@Get('test')
	async testProjectOpeningSpeed() {
		const projects = await this.projectsService.findAll();
		const startTime = new Date();
		for (let i = 0; i < 10000; i++) {
			let project = projects[Math.floor(Math.random()*projects.length)];
			await this.projectsService.findOne(project.id as string);
		}
		const endTime = new Date();
		const differnece = endTime.getTime() - startTime.getTime();
		return `Request took ${differnece} miliseconds to process`;
	}

	@UseGuards(ActiveCurrentProject)
	@Patch()
	update(@Body() updateProjectDto: UpdateProjectDto) {
		if (!updateProjectDto) {
			throw new BadRequestException(`Body should not be empty`);
		}
		return this.projectsService.updateProjectRoot(updateProjectDto);
	}

	@UseGuards(ActiveCurrentProject)
	@Post('undo')
	undo() {
		return this.projectsService.applyUndo();
	}

	@UseGuards(ActiveCurrentProject)
	@Post('redo')
	redo() {
		return this.projectsService.applyRedo();
	}

	@UseGuards(ActiveCurrentProject)
	@Delete()
	remove() {
		return this.projectsService.remove();
	}
}
