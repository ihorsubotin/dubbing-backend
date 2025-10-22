import ProjectUpdateOptions from './project-update-options';

export type ProjectUpdateOperation =
	| 'change'
	| 'appendArray'
	| 'changeArrayItem'
	| 'removeArrayItem';

export default class ProjectUpdate {
	path: string;
	operationName: ProjectUpdateOperation;
	before?: any;
	after: any;
	options: ProjectUpdateOptions;

	static reverseUpdate(update: ProjectUpdate) {
		const newUpdate = Object.assign({}, update);
		switch (newUpdate.operationName) {
			case 'change':
				const temp = newUpdate.before;
				newUpdate.before = newUpdate.after;
				newUpdate.after = temp;
				break;
			case 'appendArray':
				break;
			case 'changeArrayItem':
				break;
			case 'removeArrayItem':
				break;
		}
		return newUpdate;
	}
}
