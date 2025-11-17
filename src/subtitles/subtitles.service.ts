import { Injectable } from '@nestjs/common';
import { CreateSubtitleDto } from './dto/create-subtitle.dto';
import { UpdateSubtitleDto } from './dto/update-subtitle.dto';
import { GenericCrudService } from 'src/projects/generic-crud.service';
import { SubtitleEntry } from './entities/subtitle.entity';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class SubtitlesService extends GenericCrudService<SubtitleEntry> {
	constructor(projectsService: ProjectsService) {
		super('subtitles', projectsService);
	}

	create(createSubtitleDto: CreateSubtitleDto) {
		return 'This action adds a new subtitle';
	}

	update(id: number, updateSubtitleDto: UpdateSubtitleDto) {
		return `This action updates a #${id} subtitle`;
	}

	remove(id: number) {
		return `This action removes a #${id} subtitle`;
	}
}
