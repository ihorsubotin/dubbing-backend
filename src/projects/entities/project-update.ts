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
		const temp = newUpdate.before;
		newUpdate.before = newUpdate.after;
		newUpdate.after = temp;
		switch (newUpdate.operationName) {
			case 'change':
				break;
			case 'appendArray':
				newUpdate.operationName = 'removeArrayItem';
				break;
			case 'removeArrayItem':
				newUpdate.operationName = 'appendArray';
				break;
		}
		return newUpdate;
	}
}

export class ProjectUpdateOptions {}
