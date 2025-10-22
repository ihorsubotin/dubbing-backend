import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { ConfigModule } from '@nestjs/config';
import { AudiofilesModule } from './audiofiles/audiofiles.module';

@Module({
	imports: [ConfigModule.forRoot(), ProjectModule, AudiofilesModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
