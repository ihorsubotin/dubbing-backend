import { Module } from '@nestjs/common';
import { AudioFilesService } from './audiofiles.service';
import { AudiofilesController } from './audiofiles.controller';
import { ProjectsModule } from 'src/projects/projects.module';
import { ProjectsService } from 'src/projects/projects.service';

@Module({
	imports: [ProjectsModule],
	controllers: [AudiofilesController],
	providers: [AudioFilesService],
})
export class AudiofilesModule {}
