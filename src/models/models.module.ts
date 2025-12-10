import { Module } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';
import { ProjectsModule } from 'src/projects/projects.module';
import RabbitMQService from './rabbitmq.service';
import { ClientProvider, ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

function clientForQueue(name: string){
	return {
		imports: [ConfigModule],
		name: 'RabbitMQ_'+name,
		useFactory: async (configService: ConfigService): Promise<ClientProvider> => ({
			transport: Transport.RMQ,
			options: {
				urls: [configService.get('RABBITMQ_URL')],
				queue: name,
				queueOptions:{
					durable: true
				}
			},
		}),
		inject: [ConfigService],
	};
}

@Module({
	imports: [ProjectsModule, ClientsModule.registerAsync([
		clientForQueue('media'),
		clientForQueue('separation'),
		clientForQueue('diarization'),
		clientForQueue('recognition'),
		clientForQueue('conversion')
	]),],
	controllers: [ModelsController],
	providers: [ModelsService, RabbitMQService],
	exports: [ModelsService, RabbitMQService],
})
export class ModelsModule {}
