import ProjectUpdate from './project-update';

export default class ProjectVersion {
	name: string;
	changes: ProjectUpdate[] = [];
	skipSaving: boolean = false;
}
