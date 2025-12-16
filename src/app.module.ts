import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { ConfigModule } from '@nestjs/config';
import { AudiofilesModule } from './audiofiles/audiofiles.module';
import { ModelsModule } from './models/models.module';
import { DiarisationModule } from './diarisation/diarisation.module';
import { SubtitlesModule } from './subtitles/subtitles.module';
import { MixingModule } from './mixing/mixing.module';
import { MutexMiddleware } from './projects/middleware/single-project';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ProjectsModule,
		MixingModule,
		AudiofilesModule,
		ModelsModule,
		DiarisationModule,
		SubtitlesModule
	],
	controllers: [],
	providers: [],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(MutexMiddleware).forRoutes('*');
	}
}
