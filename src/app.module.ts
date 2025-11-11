import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { ConfigModule } from '@nestjs/config';
import { AudiofilesModule } from './audiofiles/audiofiles.module';
import { ModelsModule } from './models/models.module';
import { DiarisationModule } from './diarisation/diarisation.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ProjectsModule,
		AudiofilesModule,
		ModelsModule,
		DiarisationModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
