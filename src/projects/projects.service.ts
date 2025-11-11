import {
	Inject,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import Project from './entities/project';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import ProjectUpdate, {
	ProjectUpdateOperation,
	ProjectUpdateOptions,
} from './entities/project-update';
import { REQUEST } from '@nestjs/core';

export const DEFAULT_PROJECT = {
	audio: [],
	models: {
		diarisation: {
			model: 'pyannote3.1',
		},
		recognition: {
			model: 'whisper',
		},
		separation: {
			model: 'demucs',
		},
		translation: {
			model: 'deepl',
		},
		voiceConversion: {
			model: 'chatterbox',
		},
	},
};

@Injectable()
export class ProjectsService {
	private readonly logger = new Logger(ProjectsService.name);
	public readonly rootPath = process.env.PROJECTS_DIR || './projects';

	constructor(
		@Inject(CACHE_MANAGER)
		private cacheManager: Cache,
		@Inject(REQUEST)
		private readonly request: any,
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
		this.checkMigration(project);
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

	checkMigration(project: Project) {
		let changed = false;
		for (const variable in DEFAULT_PROJECT) {
			if (project[variable] === undefined) {
				changed = true;
				project[variable] = DEFAULT_PROJECT[variable];
			}
		}
		for (const audio of project.audio) {
			if (audio.type === undefined) {
				audio.type = 'raw';
				changed = true;
			}
		}
		for (const modelName in DEFAULT_PROJECT.models) {
			const model = project.models[modelName];
			const modelRef = DEFAULT_PROJECT.models[modelName];
			if (model === undefined) {
				project.models[modelName] = modelRef;
				changed = true;
			} else {
				for (const param in modelRef) {
					if (model[param] === undefined) {
						model[param] = modelRef[param];
						changed = true;
					}
				}
			}
		}
		return changed;
	}

	async readFromDisk(id: string) {
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
		const changed = this.checkMigration(config);
		if (changed) {
			const newFile = JSON.stringify(config);
			await fs.promises.writeFile(fullPath, newFile, { encoding: 'utf-8' });
			await this.cacheManager.set(id, newFile);
		} else {
			await this.cacheManager.set(id, configFile);
		}
		return config;
	}

	async findOne(id: string): Promise<Project | null> {
		try {
			const configData: any = await this.cacheManager.get(id);
			if (configData == undefined) {
				return await this.readFromDisk(id);
			} else {
				const config = JSON.parse(configData);
				return config;
			}
		} catch (error) {
			this.logger.warn(`Unable to find project by id. ${error}`);
			return null;
		}
	}

	getProject(): Project {
		if (this.request.project) {
			return this.request.project;
		} else {
			throw new UnauthorizedException(`Guard is not used for this request`);
		}
	}

	async applyUndo() {
		const project = this.getProject();
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

	async applyRedo() {
		const project = this.getProject();
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

	updateProjectRoot(content: Partial<Project>) {
		return this.updateProject('change', '', content);
	}

	/** Updates project with saving changes and updo options
	 * @param[updatePath] Path to change locations. For example, root: "". Audio with id: "audio/id:abc"
	 */
	async updateProject(
		operationName: ProjectUpdateOperation,
		updatePath: string,
		content: any,
		options: ProjectUpdateOptions = {},
	) {
		const project = this.getProject();
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

	private updateValues(project: Project, update: ProjectUpdate) {
		//Getting correct object path
		const pathSplit = update.path.split('/');
		let currentObject = project;
		let lastParent = project;
		let lastPath: string = '';
		try {
			for (const pathPart of pathSplit) {
				if (pathPart == '') {
					continue;
				}
				if (pathPart.includes(':')) {
					const [key, value] = pathPart.split(':');
					if (Array.isArray(currentObject)) {
						const elementIndex = currentObject.findIndex((obj) => {
							return obj[key] == value;
						});
						lastPath = elementIndex.toString();
						const element = currentObject[elementIndex];
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
					lastPath = pathPart;
					const child = currentObject[pathPart];
					if (child || lastParent) {
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
				if (currentObject === undefined || currentObject === null) {
					lastParent[lastPath] = [];
					currentObject = lastParent[lastPath];
				}
				if (Array.isArray(currentObject)) {
					update.before = undefined;
					currentObject.push(update.after);
				} else {
					this.logger.error('Unable to change to append non array');
				}
				break;
			case 'removeArrayItem':
				if (Array.isArray(currentObject)) {
					const itemIndex = currentObject.findIndex((value) => {
						if (typeof update.before === 'object') {
							for (const field in value) {
								if (value[field] !== update.before[field]) {
									return false;
								}
							}
							return true;
						} else {
							return update.before === value;
						}
					});
					if (itemIndex !== -1) {
						update.before = currentObject.splice(itemIndex, 1)[0];
						update.after = undefined;
					} else {
						this.logger.error('Unable to remove items from non array');
					}
				} else {
					this.logger.error('Unable to remove items from non array');
				}
				break;
		}
		return update;
	}

	private shallowAssign(target: object, obj: object) {
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

	private getDiffeneces(target: object, obj: object) {
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

	remove() {
		const project = this.getProject();
		//return `This action removes a #${id} project`;
	}
}
