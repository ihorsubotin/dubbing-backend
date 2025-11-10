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
	HostParam,
	Query,
} from '@nestjs/common';
import { AudioFilesService } from './audiofiles.service';
import { CreateAudiofileDto } from './dto/create-audiofile.dto';
import { UpdateAudiofileDto } from './dto/update-audiofile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActiveCurrentProject } from 'src/projects/guard/current-project';
import { GetProject } from 'src/projects/decorator/get-project';
import Project from 'src/projects/entities/project';
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
	@UseGuards(ActiveCurrentProject)
	findAllRaw(
		@GetProject() project: Project,
		@Query('name') name: string
	) {
		return this.audiofilesService.findAllRaw(project, name);
	}

	@Get(':id')
	@UseGuards(ActiveCurrentProject)
	findOne(
		@GetProject() project: Project,
		@Param('id') fileName: string,
		@Res() res: Response,
	) {
		const stream = this.audiofilesService.getAudioStream(project, fileName);
		if (stream) {
			stream.pipe(res);
			return new StreamableFile(stream);
		} else {
			throw new NotFoundException();
		}
	}

	@Patch(':id')
	@UseGuards(ActiveCurrentProject)
	async update(
		@GetProject() project: Project,
		@Param('id') fileName: string,
		@Body() updateAudiofileDto: UpdateAudiofileDto,
	) {
		const update = await this.audiofilesService.update(project, fileName, updateAudiofileDto);
		if(update){
			return update;
		}else{
			throw new NotFoundException(`File with name ${fileName} not found`);
		}
	}

	@Delete(':id')
	@UseGuards(ActiveCurrentProject)
	remove(@Param('id') id: string) {
		return this.audiofilesService.remove(+id);
	}
}
