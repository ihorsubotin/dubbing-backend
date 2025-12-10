import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ProjectsService } from '../projects.service';
import type { Request } from 'express';

@Injectable()
export class ActiveParamsProject implements CanActivate {
	constructor(private projectsService: ProjectsService) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const reqest: Request = context.switchToHttp().getRequest();
		const projectId = reqest.params?.['projectId'];
		
		if (projectId) {
			const project = await this.projectsService.findOne(projectId);
			if (project) {
				(reqest as any).project = project;
				return true;
			}
		}
		return false;
	}
}
