import { Injectable } from '@nestjs/common';
import { UseDiarisationDto } from './dto/use-diarisation.dto';
import { UpdateDiarisationDto } from './dto/update-diarisation.dto';
import { ProjectsService } from 'src/projects/projects.service';
import { ModelsService } from 'src/models/models.service';
import { AudioFilesService } from 'src/audiofiles/audiofiles.service';
import { DiarisationEntry } from './entities/diarisation.entity';
import AudioFile from 'src/audiofiles/entities/audiofile.entity';
import ProjectUpdate from 'src/projects/entities/project-update';
import { v4 as uuidv4 } from 'uuid';
import ProjectVersion from 'src/projects/entities/project-version';
import CreateDiarisationDto from './dto/create-diarisation.dto';

@Injectable()
export class DiarisationService {
	constructor(
		private projectsService: ProjectsService,
		private modelsService: ModelsService,
		private audioFilesService: AudioFilesService,
	) {}

	async create(createDiarisationDto: CreateDiarisationDto) {
		const audio = this.audioFilesService.findOne(createDiarisationDto.fileName);
		if (!audio || audio.type !== 'raw') {
			return null;
		}
		const entry = new DiarisationEntry();
		entry.fileName = createDiarisationDto.fileName;
		entry.speaker = createDiarisationDto.speaker;
		entry.startTime = createDiarisationDto.startTime;
		entry.endTime = createDiarisationDto.endTime;
		const version = new ProjectVersion();
		version.name = 'Creating new diarisation entry';
		version.changes = [this.createDiarisationUpdate(entry)];
		await this.projectsService.applyVersionForCurrent(version);
		return entry;
	}

	async use(useDiarisationDto: UseDiarisationDto): Promise<number> {
		if (useDiarisationDto.target) {
			const audio = this.audioFilesService.findOne(useDiarisationDto.target);
			if (audio) {
				const oldDiarisation = this.findForAudio(audio.fileName);
				await this.removeArray(oldDiarisation);
				this.fileDiarisation([audio]);
				return 1;
			}
			return 0;
		} else {
			const audios = this.audioFilesService.findAllRaw('');
			const oldDiarisation = this.findAll();
			await this.removeArray(oldDiarisation);
			this.fileDiarisation(audios);
			return audios.length;
		}
	}

	fileDiarisation(audios: AudioFile[]) {
		const model = this.modelsService.findOne('diarisation');
		const reqests: DiarisationEntry[] = [];
		for (const audio of audios) {
			const composition = this.audioFilesService.findComposition(
				audio.fileName,
			);
			if (composition.raw) {
				reqests.push({
					fileName: composition.raw.fileName,
					startTime: 5,
					endTime: 10,
					id: uuidv4(),
					speaker: '1',
				});
			}
		}
		this.handleResults(reqests);
	}

	async handleResults(diarisationResults: DiarisationEntry[]) {
		const version = new ProjectVersion();
		version.name = 'Applied diarisation';
		for (const entry of diarisationResults) {
			version.changes.push(this.createDiarisationUpdate(entry));
		}
		await this.projectsService.applyVersionForCurrent(version);
	}

	createDiarisationUpdate(entry: DiarisationEntry): ProjectUpdate {
		entry.id = uuidv4();
		const update = new ProjectUpdate();
		update.after = entry;
		update.operationName = 'appendArray';
		update.path = 'diarisation';
		return update;
	}

	findAll(): DiarisationEntry[] {
		const project = this.projectsService.getProject();
		return project.diarisation;
	}

	findForAudio(fileName: string): DiarisationEntry[] {
		const project = this.projectsService.getProject();
		return project.diarisation.filter((value) => value.fileName == fileName);
	}

	findSingle(id: string): DiarisationEntry | undefined {
		const project = this.projectsService.getProject();
		return project.diarisation.find((value) => value?.id === id);
	}

	findAllSpeakers(fileName: string | undefined = undefined) {
		const project = this.projectsService.getProject();
		let diarisations = project.diarisation;
		if (fileName) {
			diarisations = diarisations.filter(
				(value) => value.fileName === fileName,
			);
		}
		const set = new Set<string>(diarisations.map((value) => value.speaker));
		return [...set.values()];
	}

	async update(id: string, updateDiarisationDto: UpdateDiarisationDto) {
		const entry = this.findSingle(id);
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
			await this.projectsService.updateCurrentProject(
				'change',
				`diarisation/id:${id}`,
				updateDiarisationDto,
				'Update to diarisation',
			);
			return this.findSingle(id);
		} else {
			return undefined;
		}
	}

	async removeOne(id: string) {
		const entry = this.findSingle(id);
		if (entry) {
			await this.projectsService.updateCurrentProject(
				'removeArrayItem',
				`diarisation`,
				entry,
				'Removed diarisation entry',
			);
			return entry;
		} else {
			return undefined;
		}
	}
	async removeArray(diarisationEntries: DiarisationEntry[]) {
		const updates: ProjectUpdate[] = [];
		for (const entry of diarisationEntries) {
			const update = new ProjectUpdate();
			update.before = entry;
			update.operationName = 'removeArrayItem';
			update.path = 'diarisation';
			updates.push(update);
		}
		const version = new ProjectVersion();
		version.name = 'Removed diarisation batch';
		version.changes = updates;
		await this.projectsService.applyVersionForCurrent(version);
		return diarisationEntries;
	}
}
