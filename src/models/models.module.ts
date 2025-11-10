import { Module } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
	imports: [ProjectsModule],
	controllers: [ModelsController],
	providers: [ModelsService],
})
export class ModelsModule {}
