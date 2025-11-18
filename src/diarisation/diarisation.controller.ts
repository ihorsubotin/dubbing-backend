import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	NotFoundException,
	BadRequestException,
	ParseIntPipe,
} from '@nestjs/common';
import { DiarisationService } from './diarisation.service';
import { UpdateDiarisationDto } from './dto/update-diarisation.dto';
import { UseDiarisationDto } from './dto/use-diarisation.dto';
import { ActiveCurrentProject } from 'src/projects/guard/current-project';
import CreateDiarisationDto from './dto/create-diarisation.dto';

@Controller('diarisation')
@UseGuards(ActiveCurrentProject)
export class DiarisationController {
	constructor(private readonly diarisationService: DiarisationService) {}

	@Post()
	async create(@Body() createDiarisationDto: CreateDiarisationDto) {
		const entry = await this.diarisationService.create(createDiarisationDto);
		if (entry) {
			return entry;
		} else {
			throw new NotFoundException(`Audiofile not found`);
		}
	}

	@Post('use')
	use(@Body() useDiarisationDto: UseDiarisationDto) {
		return this.diarisationService.use(useDiarisationDto);
	}

	@Get()
	findAll() {
		return this.diarisationService.findAll();
	}

	@Get('speakers')
	getAllSpeakers() {
		return this.diarisationService.findAllSpeakers();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.diarisationService.findForAudio(id);
	}

	@Patch(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateDiarisationDto: UpdateDiarisationDto,
	) {
		const entry = await this.diarisationService.updateOne(
			id,
			updateDiarisationDto,
		);
		if (entry) {
			return entry;
		} else {
			throw new NotFoundException();
		}
	}

	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number) {
		const entry = await this.diarisationService.removeOne(id);
		if (entry) {
			return entry;
		} else {
			throw new NotFoundException();
		}
	}
}
