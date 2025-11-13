import { Injectable } from '@nestjs/common';
import { CreateMixingDto } from './dto/create-mixing.dto';
import { UpdateMixingDto } from './dto/update-mixing.dto';

@Injectable()
export class MixingService {
	create(createMixingDto: CreateMixingDto) {
		return 'This action adds a new mixing';
	}

	findAll() {
		return `This action returns all mixing`;
	}

	findOne(id: number) {
		return `This action returns a #${id} mixing`;
	}

	update(id: number, updateMixingDto: UpdateMixingDto) {
		return `This action updates a #${id} mixing`;
	}

	remove(id: number) {
		return `This action removes a #${id} mixing`;
	}
}
