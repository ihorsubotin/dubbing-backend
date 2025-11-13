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
			throw new NotFoundException(`Audio filename not found`);
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

	@Get(':name')
	findOne(@Param('name') name: string) {
		return this.diarisationService.findForAudio(name);
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateDiarisationDto: UpdateDiarisationDto,
	) {
		if (!updateDiarisationDto) {
			throw new BadRequestException(`Request body should not be empty`);
		}
		const entry = await this.diarisationService.update(
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
	async remove(@Param('id') id: string) {
		const entry = await this.diarisationService.removeOne(id);
		if (entry) {
			return entry;
		} else {
			throw new NotFoundException();
		}
	}
}
