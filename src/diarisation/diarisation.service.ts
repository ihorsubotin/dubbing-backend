import { Injectable } from '@nestjs/common';
import { UseDiarisationDto } from './dto/use-diarisation.dto';
import { UpdateDiarisationDto } from './dto/update-diarisation.dto';
import { ProjectsService } from 'src/projects/projects.service';
import { ModelsService } from 'src/models/models.service';
import { AudioFilesService } from 'src/audiofiles/audiofiles.service';
import { DiarisationEntry } from './entities/diarisation.entity';
import AudioFile from 'src/audiofiles/entities/audiofile.entity';
import CreateDiarisationDto from './dto/create-diarisation.dto';
import { GenericCrudService } from 'src/projects/generic-crud.service';

@Injectable()
export class DiarisationService extends GenericCrudService<DiarisationEntry> {
	constructor(
		protected projectsService: ProjectsService,
		private modelsService: ModelsService,
		private audioFilesService: AudioFilesService,
	) {
		super('diarisations', projectsService);
	}

	async create(createDiarisationDto: CreateDiarisationDto) {
		const audio = this.audioFilesService.findOne(createDiarisationDto.forAudio);
		if (!audio || audio.type !== 'raw') {
			return undefined;
		}
		const entry = await this.createOne(createDiarisationDto);
		return entry;
	}

	async use(useDiarisationDto: UseDiarisationDto): Promise<number> {
		if (
			useDiarisationDto?.forAudio !== null &&
			useDiarisationDto?.forAudio !== undefined
		) {
			let audios = useDiarisationDto.forAudio.map((forAudio) =>
				this.audioFilesService.findOne(forAudio),
			) as AudioFile[];
			audios = audios.filter((audio) => audio !== undefined);
			const oldDiarisation: DiarisationEntry[] = [];
			for (const audio of audios) {
				oldDiarisation.push(...this.findForAudio(audio.id));
			}
			await this.removeArray(oldDiarisation, 'Removed old diarisation');
			this.fileDiarisation(audios);
			return audios.length;
		} else {
			const audios = this.audioFilesService.search('', 'raw');
			const oldDiarisation = this.findAll();
			await this.removeArray(oldDiarisation, 'Removed old diarisation');
			this.fileDiarisation(audios);
			return audios.length;
		}
	}

	fileDiarisation(audios: AudioFile[]) {
		const model = this.modelsService.findOne('diarisation');
		const reqests: Partial<DiarisationEntry>[] = [];
		for (const audio of audios) {
			const composition = this.audioFilesService.findComposition(audio.id);
			if (composition.raw) {
				reqests.push({
					forAudio: audio.id,
					startTime: 5,
					endTime: 10,
					speaker: '1',
				});
			}
		}
		this.handleResults(reqests);
	}

	async handleResults(diarisationResults: Partial<DiarisationEntry>[]) {
		await this.createArray(diarisationResults, 'Applied diarisation');
		return diarisationResults;
	}

	findForAudio(id: number): DiarisationEntry[] {
		const diarisations = this.findAll();
		return diarisations.filter((value) => value.forAudio === id);
	}

	findAllSpeakers(id: number | undefined = undefined) {
		let diarisations = this.findAll();
		if (id !== undefined) {
			diarisations = diarisations.filter((value) => value.forAudio === id);
		}
		const set = new Set<string>(diarisations.map((value) => value.speaker));
		return [...set.values()];
	}

	async update(id: number, updateDiarisationDto: UpdateDiarisationDto) {
		const entry = this.findOne(id);
		if (entry) {
			const startTime = updateDiarisationDto.startTime
				? updateDiarisationDto.startTime
				: entry.startTime;
			const endTime = updateDiarisationDto.endTime
				? updateDiarisationDto.endTime
				: entry.endTime;
			if (endTime < startTime) {
				return undefined;
			}
			return await this.updateOne(id, updateDiarisationDto);
		} else {
			return undefined;
		}
	}
}
