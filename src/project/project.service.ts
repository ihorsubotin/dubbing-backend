import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import Project from './entities/project';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ProjectService {
	private readonly logger = new Logger(ProjectService.name);
	private readonly rootPath = process.env.PROJECTS_DIR || './projects';

	constructor(
		@Inject(CACHE_MANAGER) 
		private cacheManager: Cache
	){}

	async create(createProjectDto: CreateProjectDto) {
		const uuid = uuidv4();
		const projectPath = path.join(this.rootPath, uuid);
		await fs.promises.mkdir(projectPath);
		const project = new Project();
		project.id = uuid;
		project.creationTime = new Date();
		project.editedTime = new Date();
		project.name = createProjectDto.name;
		project.description = createProjectDto.description;
		const configPath = path.join(projectPath, 'project.json');
		await fs.promises.writeFile(configPath, JSON.stringify(project));
		return project;
	}

	async findAll() {
		const directories = await fs.promises.readdir(this.rootPath);
		const projects: Partial<Project> [] = [];
		for(const directory of directories){
			const fullPath = path.join(this.rootPath, directory);
			const stat = await fs.promises.stat(fullPath);
			if(stat.isDirectory()){
				try{
					const configPath = path.join(fullPath, 'project.json');
					const configFile = await fs.promises.readFile(configPath, {encoding: 'utf-8'});
					const config = JSON.parse(configFile);
					projects.push({
						id: config.id,
						name: config.name,
						description: config.description,
						creationTime: config.creationTime,
						editedTime: config.editedTime
					});
				}catch(err){
					this.logger.warn(`Error reading one of dirrectories ${err}`);
				}
			}
		}
		return projects;
	}

	async findOne(id: string) {
		try{
			const fullPath = path.join(this.rootPath, id, 'project.json');
			const configFile = await fs.promises.readFile(fullPath, {encoding: 'utf-8'});
			const config = JSON.parse(configFile);
			return config;
		}catch(error){
			this.logger.warn(`Unable to find project by id ${error}`);
			return null;
		}
	}

	update(id: string, updatedProject: Project) {
		return `This action updates a #${id} project`;
	}

	remove(id: number) {
		return `This action removes a #${id} project`;
	}
}
