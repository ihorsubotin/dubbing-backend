import { Module } from '@nestjs/common';
import { DiarisationService } from './diarisation.service';
import { DiarisationController } from './diarisation.controller';
import { ProjectsModule } from 'src/projects/projects.module';
import { ModelsModule } from 'src/models/models.module';
import { AudiofilesModule } from 'src/audiofiles/audiofiles.module';

@Module({
	imports: [ProjectsModule, ModelsModule, AudiofilesModule],
	controllers: [DiarisationController],
	providers: [DiarisationService],
})
export class DiarisationModule {}
