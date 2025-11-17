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
	ParseIntPipe,
	Req,
	BadRequestException,
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
	upload(@UploadedFile() file: Express.Multer.File, @Req() req) {
		if (!file) {
			throw new BadRequestException(`File is empty`);
		}
		return this.audiofilesService.uploadFile(file);
	}

	@Get()
	findAllRaw(@Query('name') name: string) {
		return this.audiofilesService.findAllRaw(name);
	}

	@Get('info/:id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		const audio = this.audiofilesService.findOne(id);
		if (audio) {
			return audio;
		} else {
			throw new NotFoundException(`Audio file not found`);
		}
	}

	@Get(':name')
	getAudioStream(@Param('name') fileName: string, @Res() res: Response) {
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
		@Param('id', ParseIntPipe) id: number,
		@Body() updateAudiofileDto: UpdateAudiofileDto,
	) {
		const update = await this.audiofilesService.updateOne(
			id,
			updateAudiofileDto,
		);
		if (update) {
			return update;
		} else {
			throw new NotFoundException(`File not found`);
		}
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.audiofilesService.remove(id);
	}
}
