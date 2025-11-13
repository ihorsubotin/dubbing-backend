import { Module } from '@nestjs/common';
import { AudioFilesService } from './audiofiles.service';
import { AudiofilesController } from './audiofiles.controller';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
	imports: [ProjectsModule],
	controllers: [AudiofilesController],
	providers: [AudioFilesService],
	exports: [AudioFilesService],
})
export class AudiofilesModule {}
