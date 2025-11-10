import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ProjectsService } from '../projects.service';

@Injectable()
export class ActiveCurrentProject implements CanActivate {
	constructor(private projectsService: ProjectsService) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const reqest = context.switchToHttp().getRequest();
		const projectId = reqest.cookies?.['project-id'];
		if (projectId) {
			const project = await this.projectsService.findOne(projectId);
			if (project) {
				reqest.project = project;
				return true;
			}
		}
		return false;
	}
}
