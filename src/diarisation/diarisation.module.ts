import { Module } from '@nestjs/common';
import { DiarisationService } from './diarisation.service';
import { DiarisationController } from './diarisation.controller';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
	imports: [ProjectsModule],
	controllers: [DiarisationController],
	providers: [DiarisationService],
})
export class DiarisationModule {}
