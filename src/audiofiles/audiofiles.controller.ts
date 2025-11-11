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
	Res,
	NotFoundException,
	StreamableFile,
	Query,
} from '@nestjs/common';
import { AudioFilesService } from './audiofiles.service';
import { UpdateAudiofileDto } from './dto/update-audiofile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActiveCurrentProject } from 'src/projects/guard/current-project';
import type { Response } from 'express';

@Controller('audio')
@UseGuards(ActiveCurrentProject)
export class AudiofilesController {
	constructor(private readonly audiofilesService: AudioFilesService) {}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	upload(@UploadedFile() file: Express.Multer.File) {
		return this.audiofilesService.uploadFile(file);
	}

	@Get()
	findAllRaw(@Query('name') name: string) {
		return this.audiofilesService.findAllRaw(name);
	}

	@Get('info/:id')
	findOne(@Param('id') fileName: string) {
		const audio = this.audiofilesService.findOne(fileName);
		if (audio) {
			return audio;
		} else {
			throw new NotFoundException(`Audio file not found`);
		}
	}

	@Get(':id')
	getAudioStream(@Param('id') fileName: string, @Res() res: Response) {
		const stream = this.audiofilesService.getAudioStream(fileName);
		if (stream) {
			stream.pipe(res);
			return new StreamableFile(stream);
		} else {
			throw new NotFoundException();
		}
	}

	@Patch(':id')
	async update(
		@Param('id') fileName: string,
		@Body() updateAudiofileDto: UpdateAudiofileDto,
	) {
		const update = await this.audiofilesService.update(
			fileName,
			updateAudiofileDto,
		);
		if (update) {
			return update;
		} else {
			throw new NotFoundException(`File with name ${fileName} not found`);
		}
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.audiofilesService.remove(+id);
	}
}
