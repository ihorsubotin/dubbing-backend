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
} from '@nestjs/common';
import { DiarisationService } from './diarisation.service';
import { UpdateDiarisationDto } from './dto/update-diarisation.dto';
import { UseDiarisationDto } from './dto/use-diarisation.dto';
import { ActiveCurrentProject } from 'src/projects/guard/current-project';
import { GetProject } from 'src/projects/decorator/get-project';
import Project from 'src/projects/entities/project';

@Controller('diarisation')
@UseGuards(ActiveCurrentProject)
export class DiarisationController {
	constructor(private readonly diarisationService: DiarisationService) {}

	@Post('use')
	create(
		@GetProject() project: Project,
		@Body() createDiarisationDto: UseDiarisationDto,
	) {
		return this.diarisationService.use(createDiarisationDto);
	}

	@Get()
	findAll() {
		return this.diarisationService.findAll();
	}

	@Get('users')
	getAllSpeakers() {
		return this.diarisationService.findAllSpeakers();
	}

	@Get(':name')
	findOne(@Param('name') name: string) {
		return this.diarisationService.findByFileName(name);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateDiarisationDto: UpdateDiarisationDto,
	) {
		return this.diarisationService.update(id, updateDiarisationDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: string) {
		return this.diarisationService.remove(+id);
	}
}
