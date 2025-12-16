import { Body, Controller, NotFoundException, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { ActiveParamsProject } from "src/projects/guard/params-project";
import { SubtitlesService } from "./subtitles.service";
import { CreateSubtitleDto } from "./dto/create-subtitle.dto";


@Controller('internal/:projectId/subtitles')
@UseGuards(ActiveParamsProject)
export default class InternalSubtitlesController {
	
	constructor(private readonly subtitlesService: SubtitlesService) {}

	@Post()
	handleSubtitles(@Body() subtitles: CreateSubtitleDto[]) {
		return this.subtitlesService.handleSubtitles(subtitles);
	}
}