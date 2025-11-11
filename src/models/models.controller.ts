import {
	Controller,
	Get,
	Body,
	Patch,
	Param,
	UseGuards,
	NotFoundException,
} from '@nestjs/common';
import { ModelsService } from './models.service';
import { UpdateModelDto } from './dto/update-model.dto';
import { ActiveCurrentProject } from 'src/projects/guard/current-project';

@Controller('models')
@UseGuards(ActiveCurrentProject)
export class ModelsController {
	constructor(private readonly modelsService: ModelsService) {}

	@Get()
	findAll() {
		return this.modelsService.findAll();
	}

	@Get(':name')
	findOne(@Param('name') name: string) {
		return this.modelsService.findOne(name);
	}

	@Patch(':name')
	async update(
		@Param('name') name: string,
		@Body() updateModelDto: UpdateModelDto,
	) {
		const update = await this.modelsService.update(name, updateModelDto);
		if (update) {
			return update;
		} else {
			throw new NotFoundException(
				`Unable to update model with given parameters`,
			);
		}
	}
}
