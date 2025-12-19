import { Body, Controller, Get, Logger, NotFoundException, Param, ParseIntPipe, Post, Query, Req, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AudioFilesService } from "./audiofiles.service";
import { ActiveParamsProject } from "src/projects/guard/params-project";
import type { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import ProcessedInfoDto from "./dto/processed-info.dto";

@Controller('internal/:projectId/audio')
@UseGuards(ActiveParamsProject)
export default class InternalAudioController {
	
	constructor(private readonly audiofilesService: AudioFilesService) {}

	@Get('info/:id')
	findComposition(@Param('id', ParseIntPipe) id: number) {
		const composition = this.audiofilesService.findComposition(id);
		if (composition.raw) {
			return composition;
		} else {
			throw new NotFoundException(`Composition not found`);
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

	@Post(':id')
	@UseInterceptors(FileInterceptor('file'))
	async upload(@UploadedFile() file: Express.Multer.File, @Param('id', ParseIntPipe) id: number, @Body() body: ProcessedInfoDto) {
		const audio = this.audiofilesService.findOne(id);
		if(audio){
			if(audio.type === 'raw' || audio.type === 'dubbed'){
				await this.audiofilesService.uploadConvertedVersion(id, file, body);
			}else if(['output', 'backgroundonly', 'voiceonly', 'converted'].includes(audio.type)){
				await this.audiofilesService.uploadActualFile(id, file, body);
			}
		}else{
			throw new NotFoundException('File id not found');
		}
	}
}