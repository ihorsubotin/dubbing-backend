import {
	createParamDecorator,
	ExecutionContext,
	NotFoundException,
} from '@nestjs/common';
import { ProjectsService } from '../projects.service';
import Project from '../entities/project';

export const GetProject = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): Project => {
		const request: any = ctx.switchToHttp().getRequest();
		if (request.project) {
			return request.project as Project;
		}
		throw new NotFoundException('Project does not exist');
	},
);
