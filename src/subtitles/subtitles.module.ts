import { Module } from '@nestjs/common';
import { SubtitlesService } from './subtitles.service';
import { SubtitlesController } from './subtitles.controller';
import { ModelsModule } from 'src/models/models.module';
import { AudiofilesModule } from 'src/audiofiles/audiofiles.module';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
	imports: [ProjectsModule, AudiofilesModule, ModelsModule],
	controllers: [SubtitlesController],
	providers: [SubtitlesService],
})
export class SubtitlesModule {}
