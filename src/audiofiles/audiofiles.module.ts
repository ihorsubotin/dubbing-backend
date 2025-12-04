import { Module } from '@nestjs/common';
import { AudioFilesService } from './audiofiles.service';
import { AudiofilesController } from './audiofiles.controller';
import { ProjectsModule } from 'src/projects/projects.module';
import InternalAudioController from './internal-audio.controller';
import { ModelsModule } from 'src/models/models.module';

@Module({
	imports: [ProjectsModule, ModelsModule],
	controllers: [AudiofilesController, InternalAudioController],
	providers: [AudioFilesService],
	exports: [AudioFilesService],
})
export class AudiofilesModule {}
