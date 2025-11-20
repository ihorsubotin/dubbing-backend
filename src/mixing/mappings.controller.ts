import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	ParseIntPipe,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { MixingService } from './mixing.service';
import { ActiveCurrentProject } from 'src/projects/guard/current-project';
import { CreateAudioMapDto } from './dto/create-map.dto';
import { UpdateAudioMapDto } from './dto/update-map.dto';
import AudioSeparationDto from './dto/audio-separation.dto';
import { AudioFilesService } from 'src/audiofiles/audiofiles.service';

@Controller('mappings')
@UseGuards(ActiveCurrentProject)
export class MappingsController {
	constructor(
		private readonly mixingService: MixingService,
		private readonly audioFilesService: AudioFilesService,
	) {}

	@Post()
	async create(@Body() createAudioMapDto: CreateAudioMapDto) {
		const audioMap = await this.mixingService.create(createAudioMapDto);
		if (audioMap) {
			return audioMap;
		} else {
			throw new BadRequestException();
		}
	}

	@Get()
	findAll() {
		return this.mixingService.findAll();
	}

	@Get(':id')
	findForAudio(@Param('id', ParseIntPipe) id: number) {
		const audio = this.audioFilesService.findOne(id);
		if (audio && audio.type === 'raw') {
			return this.mixingService.findForAudio(id);
		} else {
			throw new NotFoundException('Audio file not found');
		}
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateAudioMapDto: UpdateAudioMapDto,
	) {
		const audioMap = await this.mixingService.update(+id, updateAudioMapDto);
		if (audioMap) {
			return audioMap;
		} else {
			throw new BadRequestException();
		}
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		const audioMap = await this.mixingService.removeOne(+id);
		if (audioMap) {
			return audioMap;
		} else {
			throw new NotFoundException();
		}
	}
}
