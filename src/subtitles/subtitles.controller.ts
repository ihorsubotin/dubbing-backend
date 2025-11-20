import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	ParseIntPipe,
	NotFoundException,
	UseGuards,
} from '@nestjs/common';
import { SubtitlesService } from './subtitles.service';
import { CreateSubtitleDto } from './dto/create-subtitle.dto';
import { UpdateSubtitleDto } from './dto/update-subtitle.dto';
import GenerateSubtitlesDto from './dto/generate-subtitles.dto';
import TranslateSubtitlesDto from './dto/translate-subtitles.dto';
import { ActiveCurrentProject } from 'src/projects/guard/current-project';

@Controller('subtitles')
@UseGuards(ActiveCurrentProject)
export class SubtitlesController {
	constructor(private readonly subtitlesService: SubtitlesService) {}

	@Post('generate')
	async generate(@Body() generateSubtitlesDto: GenerateSubtitlesDto) {
		return this.subtitlesService.generate(generateSubtitlesDto);
	}

	@Post('translate')
	async translate(@Body() translateSubtitlesDto: TranslateSubtitlesDto) {
		return this.subtitlesService.translate(translateSubtitlesDto);
	}

	@Post()
	async create(@Body() createSubtitleDto: CreateSubtitleDto) {
		const entry = await this.subtitlesService.create(createSubtitleDto);
		if (entry) {
			return entry;
		} else {
			throw new NotFoundException(`Audiofile not found`);
		}
	}

	@Get()
	search(@Query() querry: { forAudio: number; language: string }) {
		return this.subtitlesService.search(querry.forAudio, querry.language);
	}

	@Get('languages')
	languages(@Query('For audio') forAudio: number) {
		return this.subtitlesService.findAllLanguages(+forAudio);
	}

	@Get(':forAudio')
	findForAudio(@Param('forAudio', ParseIntPipe) forAudio: number) {
		return this.subtitlesService.search(forAudio);
	}

	@Patch(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateSubtitleDto: UpdateSubtitleDto,
	) {
		const entry = await this.subtitlesService.updateOne(id, updateSubtitleDto);
		if (entry) {
			return entry;
		} else {
			throw new NotFoundException();
		}
	}

	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number) {
		const entry = await this.subtitlesService.remove(id);
		if (entry) {
			return entry;
		} else {
			throw new NotFoundException();
		}
	}
}
