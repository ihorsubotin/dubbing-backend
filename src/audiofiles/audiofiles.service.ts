import { Injectable } from '@nestjs/common';
import { CreateAudiofileDto } from './dto/create-audiofile.dto';
import { UpdateAudiofileDto } from './dto/update-audiofile.dto';

@Injectable()
export class AudiofilesService {
	create(createAudiofileDto: CreateAudiofileDto) {
		return 'This action adds a new audiofile';
	}

	findAll() {
		return `This action returns all audiofiles`;
	}

	findOne(id: number) {
		return `This action returns a #${id} audiofile`;
	}

	update(id: number, updateAudiofileDto: UpdateAudiofileDto) {
		return `This action updates a #${id} audiofile`;
	}

	remove(id: number) {
		return `This action removes a #${id} audiofile`;
	}
}
