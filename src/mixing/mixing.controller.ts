import {
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ActiveCurrentProject } from 'src/projects/guard/current-project';
import { MixingService } from './mixing.service';
import { AudioFilesService } from 'src/audiofiles/audiofiles.service';

@Controller('audio')
@UseGuards(ActiveCurrentProject)
export class MixingController {
	constructor(
		private mixingService: MixingService,
		private audioFilesService: AudioFilesService,
	) {}

	@Post(':id/separation')
	spearate(@Param('id', ParseIntPipe) id: number) {
		const audio = this.audioFilesService.findOne(id);
		if (audio && audio.type === 'raw') {
			return this.mixingService.separateAudio();
		} else {
			throw new NotFoundException();
		}
	}
	@Post(':id/conversion')
	conversion(@Param('id', ParseIntPipe) id: number) {
		const audio = this.audioFilesService.findOne(id);
		if (audio && audio.type === 'dubbed') {
			return this.mixingService.convertAudio();
		} else {
			throw new NotFoundException();
		}
	}

	@Get('output')
	getOutputs() {
		return this.audioFilesService.search('', 'output');
	}

	@Get(':id/output')
	getOutputsForAudio(@Param('id', ParseIntPipe) id: number) {
		const audio = this.audioFilesService.findOne(id);
		if (audio && audio.type === 'raw') {
			return this.audioFilesService.findOutputFor(id);
		} else {
			throw new NotFoundException();
		}
	}

	@Post(':id/produce')
	renderComposition(@Param('id', ParseIntPipe) id: number) {
		const audio = this.audioFilesService.findOne(id);
		if (audio && audio.type === 'raw') {
			return this.mixingService.produceOutput(id);
		} else {
			throw new NotFoundException();
		}
	}
}
