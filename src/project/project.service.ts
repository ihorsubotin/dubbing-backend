import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import Project from './entities/project';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import UpdateOptions from './entities/project-update-options';
import ProjectUpdate, {
	ProjectUpdateOperation,
} from './entities/project-update';
import { diff } from 'node:util';

@Injectable()
export class ProjectService {
	private readonly logger = new Logger(ProjectService.name);
	private readonly rootPath = process.env.PROJECTS_DIR || './projects';

	constructor(
		@Inject(CACHE_MANAGER)
		private cacheManager: Cache,
	) {}

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
		await this.saveProjectOnDisk(project);
		return project;
	}

	async saveProjectOnDisk(project: Project) {
		const configFile = JSON.stringify(project);
		await this.cacheManager.set(project.id, configFile);
		const filePath = path.join(this.rootPath, project.id, 'project.json');
		await fs.promises.writeFile(filePath, configFile);
	}

	async findAll() {
		const directories = await fs.promises.readdir(this.rootPath);
		const projects: Partial<Project>[] = [];
		for (const directory of directories) {
			const fullPath = path.join(this.rootPath, directory);
			const stat = await fs.promises.stat(fullPath);
			if (stat.isDirectory()) {
				try {
					const configPath = path.join(fullPath, 'project.json');
					const configFile = await fs.promises.readFile(configPath, {
						encoding: 'utf-8',
					});
					const config = JSON.parse(configFile);
					projects.push({
						id: config.id,
						name: config.name,
						description: config.description,
						creationTime: config.creationTime,
						editedTime: config.editedTime,
					});
				} catch (err) {
					this.logger.warn(`Error reading one of dirrectories ${err}`);
				}
			}
		}
		projects.sort((a, b) => {
			return (
				new Date(b.editedTime || 0).getTime() -
				new Date(a.editedTime || 0).getTime()
			);
		});
		return projects;
	}

	async findOne(id: string): Promise<Project | null> {
		try {
			const configData: any = await this.cacheManager.get(id);
			if (configData == undefined) {
				if (
					!id.match(
						/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
					)
				) {
					throw `Invalid UUID`;
				}
				const fullPath = path.join(this.rootPath, id, 'project.json');
				const configFile = await fs.promises.readFile(fullPath, {
					encoding: 'utf-8',
				});
				const config = JSON.parse(configFile);
				await this.cacheManager.set(id, configFile);
				return config;
			} else {
				const config = JSON.parse(configData);
				return config;
			}
		} catch (error) {
			this.logger.warn(`Unable to find project by id. ${error}`);
			return null;
		}
	}

	async applyUndo(project: Project) {
		let update = project.undoUpdates.pop();
		if (update === undefined) {
			throw new NotFoundException('Unable to apply undo');
		}
		project.redoUpdates.push(update);
		update = ProjectUpdate.reverseUpdate(update);
		this.updateValues(project, update);
		project.editedTime = new Date();
		await this.saveProjectOnDisk(project);
		return project;
	}

	async applyRedo(project: Project) {
		const update = project.redoUpdates.pop();
		if (update === undefined) {
			throw new NotFoundException('Unable to apply redo');
		}
		this.updateValues(project, update);
		project.editedTime = new Date();
		project.undoUpdates.push(update);
		await this.saveProjectOnDisk(project);
		return project;
	}

	updateProjectRoot(project: Project, content: Partial<Project>) {
		return this.updateProject(project, 'change', '', content);
	}

	/** Updates project with saving changes and updo options
	 * @param[updatePath] Path to change locations. For example, root: "". Audio with id: "audio/id:abc"
	 */
	async updateProject(
		project: Project,
		operationName: ProjectUpdateOperation,
		updatePath: string,
		content: any,
		options: UpdateOptions = {},
	) {
		let update = new ProjectUpdate();
		update.operationName = operationName;
		update.path = updatePath;
		update.after = content;
		update.options = options;
		update = this.updateValues(project, update);
		//Saving changes
		if (project.undoUpdates) {
			project.undoUpdates.push(update);
		} else {
			project.undoUpdates = [update];
		}
		project.redoUpdates = [];
		project.editedTime = new Date();
		await this.saveProjectOnDisk(project);
		return project;
	}

	updateValues(project: Project, update: ProjectUpdate) {
		//Getting correct object path
		const pathSplit = update.path.split('/');
		let currentObject = project;
		let lastParent = project;
		try {
			for (const pathPart of pathSplit) {
				if (pathPart == '') {
					continue;
				}
				if (pathPart.includes(':')) {
					const [key, value] = pathPart.split(':');
					if (Array.isArray(currentObject)) {
						const element = currentObject.find((obj) => {
							return obj[key] == value;
						});
						if (element) {
							lastParent = currentObject;
							currentObject = element;
						} else {
							throw 'Unable to find array item';
						}
					} else {
						throw 'Unable to find array item in object';
					}
				} else if (typeof currentObject == 'object') {
					const child = currentObject[pathPart];
					if (child) {
						lastParent = currentObject;
						currentObject = child;
					} else {
						throw 'Unable to find given path';
					}
				} else {
					throw 'Trying to go into existing object';
				}
			}
		} catch (err) {
			this.logger.error(`Error in update path traversing:\n ${err}`);
		}
		const lastPath = pathSplit[pathSplit.length - 1];
		//Changing variable
		switch (update.operationName) {
			case 'change':
				if (typeof update.after === 'object') {
					update.before = this.getDiffeneces(currentObject, update.after);
					this.shallowAssign(currentObject, update.after);
				} else {
					update.before = lastParent[lastPath];
					lastParent[lastPath] = update.after;
				}
				break;
			case 'appendArray':
				break;
			case 'changeArrayItem':
				break;
			case 'removeArrayItem':
				break;
		}
		return update;
	}

	shallowAssign(target: object, obj: object) {
		if (typeof target === 'object' && typeof obj === 'object') {
			for (const field in obj) {
				if (typeof obj[field] !== 'object') {
					target[field] = obj[field];
				}
			}
		} else {
			this.logger.warn('Wrong shallow assignment');
		}
	}

	getDiffeneces(target: object, obj: object) {
		if (typeof target === 'object' && typeof obj === 'object') {
			const diffeneces = {};
			for (const field in obj) {
				if (typeof obj[field] !== 'object' && target[field] !== obj[field]) {
					diffeneces[field] = target[field];
				}
			}
			return diffeneces;
		} else {
			this.logger.warn(
				'Unable to determine diffenece within elements assignment',
			);
		}
	}

	remove(project: Project) {
		//return `This action removes a #${id} project`;
	}
}
