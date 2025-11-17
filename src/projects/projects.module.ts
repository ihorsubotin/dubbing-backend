import { Global, Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { ActiveCurrentProject } from './guard/current-project';

@Global()
@Module({
	imports: [CacheModule.register()],
	controllers: [ProjectsController],
	providers: [ProjectsService, ActiveCurrentProject],
	exports: [ProjectsService],
})
export class ProjectsModule {}
