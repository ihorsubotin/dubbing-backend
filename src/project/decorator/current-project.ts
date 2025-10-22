import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";
import { ProjectService } from "../project.service";
import Project from "../entities/project";

export const GetProject = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): Project => {
		const request = ctx.switchToHttp().getRequest();
		if(request.project){
			return request.project;
		}
		throw new NotFoundException('Project does not exist');
	},
);