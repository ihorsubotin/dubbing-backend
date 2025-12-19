import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ProjectsService } from "src/projects/projects.service";

@Injectable()
export default class RabbitMQService{
	
	constructor(
		@Inject('RabbitMQ_media')
		private mediaClient: ClientProxy,
		@Inject('RabbitMQ_separation')
		private separationClient: ClientProxy,
		@Inject('RabbitMQ_diarisation')
		private diarisationClient: ClientProxy,
		@Inject('RabbitMQ_recognition')
		private recognitionClient: ClientProxy,
		@Inject('RabbitMQ_conversion')
		private conversionClient: ClientProxy,
		private projectsService: ProjectsService
	){
	
	}
	async test(){
		this.mediaClient.emit('convert', {
			project: this.projectsService.getProject().id,
			fileName: "509babd6-7489-4445-a64b-b93a1468216a.mp3"
		});
	}

	emitMediaRequest(event: string, body: object){
		this.mediaClient.emit(event, body);
	}

	emitSeparationRequest(event: string, body: object){
		this.separationClient.emit(event, body);
	}

	emitDiarisationRequest(event: string, body: object){
		this.diarisationClient.emit(event, body);
	}

	emitRecognitionRequest(event: string, body: object){
		this.recognitionClient.emit(event, body);
	}

	emitConversionRequest(event: string, body: object){
		this.conversionClient.emit(event, body);
	}

}