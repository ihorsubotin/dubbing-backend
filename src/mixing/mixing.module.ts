import { Module } from '@nestjs/common';
import { MixingService } from './mixing.service';
import { MixingController } from './mixing.controller';

@Module({
	controllers: [MixingController],
	providers: [MixingService],
})
export class MixingModule {}
