import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ProjectService } from "../project.service";

@Injectable()
export class ActiveCurrentProject implements CanActivate {
	constructor(
		private projectService: ProjectService
	){}
	async canActivate(
		context: ExecutionContext,
	): Promise<boolean> {
		const reqest = context.switchToHttp().getRequest();
		const projectId = reqest.cookies?.['project-id'];
		if(projectId){
			const project = await this.projectService.findOne(projectId);
			if(project){
				reqest.project = project;
				return true;
			}
		}
		return false;
	}
}