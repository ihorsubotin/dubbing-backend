import { Module } from '@nestjs/common';
import { AudioFilesService } from './audiofiles.service';
import { AudiofilesController } from './audiofiles.controller';
import { ProjectModule } from 'src/project/project.module';
import { ProjectService } from 'src/project/project.service';

@Module({
	imports: [ProjectModule],
	controllers: [AudiofilesController],
	providers: [AudioFilesService],
})
export class AudiofilesModule {}
