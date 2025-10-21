import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
	imports: [CacheModule.register()],
	controllers: [ProjectController],
	providers: [ProjectService],
})
export class ProjectModule {}
