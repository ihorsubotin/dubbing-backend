import ProjectUpdateOptions from "./project-update-options";

export type ProjectUpdateOperation = 'change'|'appendArray'|'changeArrayItem'|'removeArrayItem'

export default class ProjectUpdate{
	path: string;
	operationName: ProjectUpdateOperation;
	before: any;
	after: any;
	options: ProjectUpdateOptions
}