import { Module } from '@nestjs/common';
import { MixingService } from './mixing.service';
import { MappingsController } from './mappings.controller';
import { MixingController } from './mixing.controller';
import { AudiofilesModule } from 'src/audiofiles/audiofiles.module';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
	imports: [ProjectsModule, AudiofilesModule],
	controllers: [MappingsController, MixingController],
	providers: [MixingService],
})
export class MixingModule {}
