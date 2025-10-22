import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { ActiveCurrentProject } from './guard/current-project';

@Module({
	imports: [CacheModule.register()],
	controllers: [ProjectController],
	providers: [ProjectService, ActiveCurrentProject],
})
export class ProjectModule {}
