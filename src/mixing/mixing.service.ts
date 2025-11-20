import { Injectable } from '@nestjs/common';
import { GenericCrudService } from 'src/projects/generic-crud.service';
import { AudioMap } from './entities/audio-map.entity';
import { ProjectsService } from 'src/projects/projects.service';
import { UpdateAudioMapDto } from './dto/update-map.dto';
import { CreateAudioMapDto } from './dto/create-map.dto';
import { AudioFilesService } from 'src/audiofiles/audiofiles.service';

@Injectable()
export class MixingService extends GenericCrudService<AudioMap> {
	constructor(
		protected projectsService: ProjectsService,
		private audioFilesService: AudioFilesService,
	) {
		super('mappings', projectsService);
	}

	separateAudio() {
		return { filename: 'helloseparate' };
	}

	convertAudio() {
		return { filename: 'helloconverted' };
	}

	produceOutput(id: number) {
		return { filename: 'hello' };
	}

	create(createAudioMapDto: CreateAudioMapDto) {
		const fromAudio = this.audioFilesService.findOne(
			createAudioMapDto.fromAudio,
		);
		const toAudio = this.audioFilesService.findOne(createAudioMapDto.toAudio);
		if (
			fromAudio &&
			fromAudio.type === 'dubbed' &&
			toAudio &&
			toAudio.type === 'raw'
		) {
			if (createAudioMapDto.fromStartTime < createAudioMapDto.fromEndTime) {
				const audioMap = this.createOne(createAudioMapDto);
				return audioMap;
			} else {
				return undefined;
			}
		} else {
			return undefined;
		}
	}

	findForAudio(id: number) {
		return this.findAll().filter((mapping) => mapping.toAudio === id);
	}

	async update(id: number, updateAudioMapDto: UpdateAudioMapDto) {
		const audioMap = this.findOne(id);
		if (audioMap) {
			const startTime = updateAudioMapDto.fromStartTime
				? updateAudioMapDto.fromStartTime
				: audioMap.fromStartTime;
			const endTime = updateAudioMapDto.fromEndTime
				? updateAudioMapDto.fromEndTime
				: audioMap.fromEndTime;
			if (startTime < endTime) {
				const audioMap = await this.updateOne(id, updateAudioMapDto);
				return audioMap;
			} else {
				return undefined;
			}
		} else {
			return undefined;
		}
	}
}
