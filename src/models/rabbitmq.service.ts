import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ProjectsService } from "src/projects/projects.service";

@Injectable()
export default class RabbitMQService{
	
	constructor(
		@Inject('RabbitMQ_media')
		private mediaClient: ClientProxy,
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

}