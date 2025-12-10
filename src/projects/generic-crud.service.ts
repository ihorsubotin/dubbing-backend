import ProjectArray from './entities/project-array';
import ProjectUpdate from './entities/project-update';
import ProjectVersion from './entities/project-version';
import { ProjectsService } from './projects.service';

export class GenericCrudService<T extends { id: number }> {
	constructor(
		private variableName: string,
		protected projectsService: ProjectsService,
	) {
		if (
			!['audio', 'diarisations', 'subtitles', 'mappings'].includes(variableName)
		) {
			throw new Error('variable type not found');
		}
	}

	currentArray() {
		return this.projectsService.getProject()[
			this.variableName
		] as ProjectArray<T>;
	}

	async createOne(
		entry: Partial<T>,
		updateText: string | undefined = undefined,
		skipSaving: boolean = false
	) {
		const currentArray = this.currentArray();
		entry.id = currentArray.index;
		const updateEntry = new ProjectUpdate();
		updateEntry.after = entry;
		updateEntry.operationName = 'appendArray';
		updateEntry.path = this.variableName + '/array';
		const updateIndex = new ProjectUpdate();
		updateIndex.after = currentArray.index + 1;
		updateIndex.operationName = 'change';
		updateIndex.path = this.variableName + '/index';
		const version = new ProjectVersion();
		version.name = updateText
			? updateText
			: `Creating new ${this.variableName} entry`;
		if(skipSaving)
			version.skipSaving = true;
		version.changes = [updateEntry, updateIndex];
		await this.projectsService.applyVersionForCurrent(version);
		return entry;
	}

	async createArray(
		entries: Partial<T>[],
		updateText: string | undefined = undefined,
		skipSaving: boolean = false
	) {
		const currentArray = this.currentArray();
		let index = currentArray.index;
		const updates: ProjectUpdate[] = [];
		for (const entry of entries) {
			entry.id = index;
			index++;
			const updateEntry = new ProjectUpdate();
			updateEntry.after = entry;
			updateEntry.operationName = 'appendArray';
			updateEntry.path = this.variableName + '/array';
			updates.push(updateEntry);
		}
		const updateIndex = new ProjectUpdate();
		updateIndex.after = index;
		updateIndex.operationName = 'change';
		updateIndex.path = this.variableName + '/index';
		updates.push(updateIndex);
		const version = new ProjectVersion();
		version.name = updateText
			? updateText
			: `Creating new ${this.variableName} entries`;
		version.changes = updates;
		version.skipSaving = skipSaving;
		await this.projectsService.applyVersionForCurrent(version);
		return entries;
	}

	findAll(): T[] {
		const currentArray = this.currentArray();
		return currentArray.array;
	}

	findOne(id: number): T | undefined {
		const currentArray = this.currentArray();
		return currentArray.array.find((value) => value?.id === id);
	}

	async updateOne(
		id: number,
		update: Partial<T>,
		updateText: string | undefined = undefined,
		skipSaving: boolean = false
	) {
		const entry = this.findOne(id);
		if (update === null || update === undefined) {
			update = {};
		}
		if (entry) {
			await this.projectsService.updateCurrentProject(
				'change',
				`${this.variableName}/array/id:${id}`,
				update,
				updateText ? updateText : `Update to ${this.variableName}`,
				skipSaving
			);
			return this.findOne(id);
		} else {
			return undefined;
		}
	}

	async removeOne(
		id: number, 
		updateText: string | undefined = undefined,
		skipSaving: boolean = false
	) {
		const entry = this.findOne(id);
		if (entry) {
			await this.projectsService.updateCurrentProject(
				'removeArrayItem',
				`${this.variableName}/array`,
				entry,
				updateText ? updateText : `Removed ${this.variableName} entry`,
				skipSaving
			);
			return entry;
		} else {
			return undefined;
		}
	}
	async removeArray(entries: T[], updateText: string | undefined = undefined) {
		const updates: ProjectUpdate[] = [];
		for (const entry of entries) {
			const update = new ProjectUpdate();
			update.before = entry;
			update.operationName = 'removeArrayItem';
			update.path = `${this.variableName}/array`;
			updates.push(update);
		}
		const version = new ProjectVersion();
		version.name = updateText
			? updateText
			: `Removed ${this.variableName} batch`;
		version.changes = updates;
		await this.projectsService.applyVersionForCurrent(version);
		return entries;
	}
}
