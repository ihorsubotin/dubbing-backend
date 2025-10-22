import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { AudiofilesService } from './audiofiles.service';
import { CreateAudiofileDto } from './dto/create-audiofile.dto';
import { UpdateAudiofileDto } from './dto/update-audiofile.dto';

@Controller('audiofiles')
export class AudiofilesController {
	constructor(private readonly audiofilesService: AudiofilesService) {}

	@Post()
	create(@Body() createAudiofileDto: CreateAudiofileDto) {
		return this.audiofilesService.create(createAudiofileDto);
	}

	@Get()
	findAll() {
		return this.audiofilesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.audiofilesService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateAudiofileDto: UpdateAudiofileDto,
	) {
		return this.audiofilesService.update(+id, updateAudiofileDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.audiofilesService.remove(+id);
	}
}
