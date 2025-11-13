import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { MixingService } from './mixing.service';
import { CreateMixingDto } from './dto/create-mixing.dto';
import { UpdateMixingDto } from './dto/update-mixing.dto';

@Controller('mixing')
export class MixingController {
	constructor(private readonly mixingService: MixingService) {}

	@Post()
	create(@Body() createMixingDto: CreateMixingDto) {
		return this.mixingService.create(createMixingDto);
	}

	@Get()
	findAll() {
		return this.mixingService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.mixingService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateMixingDto: UpdateMixingDto) {
		return this.mixingService.update(+id, updateMixingDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.mixingService.remove(+id);
	}
}
