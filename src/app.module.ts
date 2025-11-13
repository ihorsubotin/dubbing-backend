import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { ConfigModule } from '@nestjs/config';
import { AudiofilesModule } from './audiofiles/audiofiles.module';
import { ModelsModule } from './models/models.module';
import { DiarisationModule } from './diarisation/diarisation.module';
import { SubtitlesModule } from './subtitles/subtitles.module';
import { MixingModule } from './mixing/mixing.module';
import { ConversionModule } from './conversion/conversion.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ProjectsModule,
		AudiofilesModule,
		ModelsModule,
		DiarisationModule,
		SubtitlesModule,
		MixingModule,
		ConversionModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
