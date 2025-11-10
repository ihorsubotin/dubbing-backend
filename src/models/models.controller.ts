import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { ModelsService } from './models.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';

@Controller('models')
export class ModelsController {
	constructor(private readonly modelsService: ModelsService) {}

	@Post()
	create(@Body() createModelDto: CreateModelDto) {
		return this.modelsService.create(createModelDto);
	}

	@Get('all')
	findAll() {
		return this.modelsService.findAll();
	}

	@Get(':name')
	findOne(@Param('name') id: string) {
		return this.modelsService.findOne(+id);
	}

	@Patch(':name')
	update(@Param('name') id: string, @Body() updateModelDto: UpdateModelDto) {
		return this.modelsService.update(+id, updateModelDto);
	}
}
