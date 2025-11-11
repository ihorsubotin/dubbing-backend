import { Injectable } from '@nestjs/common';
import { UseDiarisationDto } from './dto/use-diarisation.dto';
import { UpdateDiarisationDto } from './dto/update-diarisation.dto';

@Injectable()
export class DiarisationService {
	use(useDiarisationDto: UseDiarisationDto) {
		return 'This action adds a new diarisation';
	}

	findAll() {
		return `This action returns all diarisation`;
	}

	findAllSpeakers() {
		return `Speakers`;
	}

	findByFileName(name: string) {
		return `This action returns a #${name} diarisation`;
	}

	update(id: number, updateDiarisationDto: UpdateDiarisationDto) {
		return `This action updates a #${id} diarisation`;
	}

	remove(id: number) {
		return `This action removes a #${id} diarisation`;
	}
}
