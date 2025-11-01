import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	UploadedFile,
	UseGuards,
	ParseUUIDPipe,
	Res,
	NotFoundException,
	StreamableFile,
} from '@nestjs/common';
import { AudioFilesService } from './audiofiles.service';
import { CreateAudiofileDto } from './dto/create-audiofile.dto';
import { UpdateAudiofileDto } from './dto/update-audiofile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActiveCurrentProject } from 'src/project/guard/current-project';
import { GetProject } from 'src/project/decorator/current-project';
import Project from 'src/project/entities/project';
import type { Response } from 'express';

@Controller('audio')
export class AudiofilesController {
	constructor(private readonly audiofilesService: AudioFilesService) {}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	@UseGuards(ActiveCurrentProject)
	upload(
		@GetProject() project: Project,
		@UploadedFile() file: Express.Multer.File,
	) {
		return this.audiofilesService.uploadFile(project, file);
	}

	@Get()
	findAll() {
		return this.audiofilesService.findAll();
	}

	@Get(':id')
	@UseGuards(ActiveCurrentProject)
	findOne(
		@GetProject() project: Project,
		@Param('id') filename: string,
		@Res() res: Response,
	) {
		const stream = this.audiofilesService.getAudioStream(project, filename);
		if (stream) {
			stream.pipe(res);
			//return new StreamableFile(stream);
		} else {
			throw new NotFoundException();
		}
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
