import {
	Controller,
	Get,
	Body,
	Patch,
	Param,
	UseGuards,
	NotFoundException,
	Post,
} from '@nestjs/common';
import { ModelsService } from './models.service';
import { UpdateModelDto } from './dto/update-model.dto';
import { ActiveCurrentProject } from 'src/projects/guard/current-project';
import RabbitMQService from './rabbitmq.service';

@Controller('models')
@UseGuards(ActiveCurrentProject)
export class ModelsController {
	constructor(
		private readonly modelsService: ModelsService,
		private readonly rabbitMQService: RabbitMQService
	) {}

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

	@Post('emit')
	emit(){
		this.rabbitMQService.test();
	}
}
