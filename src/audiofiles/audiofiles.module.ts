import { Module } from '@nestjs/common';
import { AudiofilesService } from './audiofiles.service';
import { AudiofilesController } from './audiofiles.controller';

@Module({
	controllers: [AudiofilesController],
	providers: [AudiofilesService],
})
export class AudiofilesModule {}
