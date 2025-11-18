import { Injectable } from '@nestjs/common';
import { CreateSubtitleDto } from './dto/create-subtitle.dto';
import { UpdateSubtitleDto } from './dto/update-subtitle.dto';
import { GenericCrudService } from 'src/projects/generic-crud.service';
import { SubtitleEntry } from './entities/subtitle.entity';
import { ProjectsService } from 'src/projects/projects.service';
import { AudioFilesService } from 'src/audiofiles/audiofiles.service';
import GenerateSubtitlesDto from './dto/generate-subtitles.dto';
import AudioFile from 'src/audiofiles/entities/audiofile.entity';
import { ModelsService } from 'src/models/models.service';
import TranslateSubtitlesDto from './dto/translate-subtitles.dto';

@Injectable()
export class SubtitlesService extends GenericCrudService<SubtitleEntry> {
	constructor(
		protected projectsService: ProjectsService,
		private audioFilesService: AudioFilesService,
		private modelsService: ModelsService
	) {
		super('subtitles', projectsService);
	}

	async create(createSubtitleDto: CreateSubtitleDto) {
		const audio = this.audioFilesService.findOne(createSubtitleDto.forAudio);
		if (!audio || audio.type !== 'raw') {
			return undefined;
		}
		if(createSubtitleDto.translationOf){
			const original = this.findOne(createSubtitleDto.translationOf);
			if(!original){
				createSubtitleDto.translationOf = undefined;
			}
		}
		const entry = await this.createOne(createSubtitleDto);
		return entry;
	}
	
	//We find all audio files to generate subtitles for
	async generate(generateSubtitlesDto: GenerateSubtitlesDto): Promise<number> {
		if (
			generateSubtitlesDto?.forAudio !== null &&
			generateSubtitlesDto?.forAudio !== undefined
		) {
			let audios = generateSubtitlesDto.forAudio.map(
				forAudio => this.audioFilesService.findOne(forAudio)
			) as AudioFile[];
			audios = audios.filter(audio => audio !== undefined);
			const oldSubtitles: SubtitleEntry[] = [];
			for(const audio of audios){
				oldSubtitles.push(...this.search(audio.id));
			}
			await this.removeArray(oldSubtitles, 'Removed old subtitles');
			this.fileSubtitles(audios);
			return audios.length;
		} else {
			const audios = this.audioFilesService.findAllRaw('');
			const oldSubtitles = this.findAll();
			await this.removeArray(oldSubtitles, 'Removed old subtitles');
			this.fileSubtitles(audios);
			return audios.length;
		}
	}
	
	//We apply model to the list of audio files
	fileSubtitles(audios: AudioFile[]) {
		const model = this.modelsService.findOne('recognition');
		const reqests: CreateSubtitleDto[] = [];
		for (const audio of audios) {
			const composition = this.audioFilesService.findComposition(
				audio.fileName,
			);
			if (composition.raw) {
				reqests.push({
					forAudio: audio.id,
					startTime: 4,
					endTime: 7,
					language: 'en',
					text: 'Some text person spreaks'
				});
			}
		}
		this.handleSubtitles(reqests);
	}
	
	async handleSubtitles(subtitlesResults: CreateSubtitleDto[]) {
		await this.createArray(subtitlesResults, 'Subtitles generated');
		return subtitlesResults;
	}

	//We find all subtitles which needs to be translated
	async translate(translateSubtitlesDto: TranslateSubtitlesDto){
		let translateFrom: SubtitleEntry[] = [];
		let oldSubtitles: SubtitleEntry[] = [];
		if (
			translateSubtitlesDto?.forAudio !== null &&
			translateSubtitlesDto?.forAudio !== undefined
		) {
			let audios = translateSubtitlesDto.forAudio.map(
				forAudio => this.audioFilesService.findOne(forAudio)
			) as AudioFile[];
			audios = audios.filter(audio => audio !== undefined);
			for(const audio of audios){
				const subtitles =  this.search(audio.id);
				oldSubtitles =  subtitles.filter(subtitle => subtitle.language === translateSubtitlesDto.language);
				translateFrom =  subtitles.filter(subtitle => subtitle.translationOf === undefined);
			}
		} else {
			if(			
				translateSubtitlesDto?.forSubtitle !== null &&
				translateSubtitlesDto?.forSubtitle !== undefined
			){
				let subtitles = translateSubtitlesDto?.forSubtitle.map(
					id => this.findOne(id)
				) as SubtitleEntry[];
				for(const subtitle of subtitles){
					oldSubtitles.push(...this.findAll().filter(entry=>entry.translationOf === subtitle.id));
				}
				translateFrom = subtitles.filter(subtitle => subtitle !== undefined && subtitle.translationOf === undefined);
			}else{
				const subtitles =  this.findAll();
				oldSubtitles =  subtitles.filter(subtitle => subtitle.language === translateSubtitlesDto.language);
				translateFrom =  subtitles.filter(subtitle => subtitle.translationOf === undefined);
			}
		}
		await this.removeArray(oldSubtitles, 'Removed old subtitles');
		this.translateEntries(translateFrom, translateSubtitlesDto.language);
		return translateFrom.length;
	}

	translateEntries(subtitles: SubtitleEntry[], language: string){
		const model = this.modelsService.findOne('translation');
		const reqests: CreateSubtitleDto[] = [];
		for (const subtitle of subtitles) {
			reqests.push({
				translationOf: subtitle.id,
				forAudio: subtitle.forAudio,
				startTime: subtitle.startTime,
				endTime: subtitle.endTime,
				language: language,
				text: 'Переклад тексту'
			});
		}
		this.handleSubtitles(reqests);
	}

	getOriginalByTranslation(subtitles: SubtitleEntry[]){
		const originals = subtitles.map(subtitle=>
			subtitle.translationOf?this.findOne(subtitle.translationOf):undefined
		).filter(subtitles => subtitles !== undefined);
		return originals;
	}
	
	search(audioId: number | undefined = undefined, language: string | undefined  = undefined): SubtitleEntry[] {
		let subtitles = this.findAll();
		if(audioId !== undefined){
			subtitles = subtitles.filter(value=>value.forAudio === audioId);
		}
		if(language !== undefined){
			subtitles = subtitles.filter(value=>value.language === language);
		}
		return subtitles;
	}

	findAllLanguages(id: number | undefined = undefined) {
		let subtitles = this.findAll();
		if (id) {
			subtitles = subtitles.filter((value) => value.forAudio === id);
		}
		const set = new Set<string>(subtitles.map((value) => value.language));
		return [...set.values()];
	}
		
	async update(id: number, updateSubtitleDto: UpdateSubtitleDto) {
		const entry = this.findOne(id);
		if (entry) {
			const startTime = updateSubtitleDto.startTime
				? updateSubtitleDto.startTime
				: entry.startTime;
			const endTime = updateSubtitleDto.endTime
				? updateSubtitleDto.endTime
				: entry.endTime;
			if (endTime < startTime) {
				return undefined;
			}
			return await this.updateOne(id, updateSubtitleDto);
		} else {
			return undefined;
		}
	}

	async remove(id: number){
		const subtitle = this.findOne(id);
		if(subtitle){
			const translations = this.findAll().filter(entry=>entry.translationOf === subtitle.id);
			return await this.removeArray([subtitle, ...translations]);
		}else{
			return undefined;
		}
	}
}
