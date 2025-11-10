import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { ConfigModule } from '@nestjs/config';
import { AudiofilesModule } from './audiofiles/audiofiles.module';
import { ModelsModule } from './models/models.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ProjectsModule,
		AudiofilesModule,
		ModelsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
