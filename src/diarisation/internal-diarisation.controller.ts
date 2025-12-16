import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { DiarisationService } from "./diarisation.service";
import CreateDiarisationDto from "./dto/create-diarisation.dto";
import { ActiveParamsProject } from "src/projects/guard/params-project";

@Controller('internal/:projectId/diarisation')
@UseGuards(ActiveParamsProject)
export default class InternalDiarisationController {
	
	constructor(private readonly diarisationService: DiarisationService) {}

	@Post()
	handleSubtitles(@Body() diarisarions: CreateDiarisationDto[]) {
		return this.diarisationService.handleResults(diarisarions);
	}
}