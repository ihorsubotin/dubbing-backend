import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AudiofilesModule } from './audiofiles/audiofiles.module';
import { ModelsModule } from './models/models.module';
import { DiarisationModule } from './diarisation/diarisation.module';
import { SubtitlesModule } from './subtitles/subtitles.module';
import { MixingModule } from './mixing/mixing.module';
import { ConversionModule } from './conversion/conversion.module';
import { ClientProvider, ClientsModule, RmqOptions, Transport } from '@nestjs/microservices';
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface';

function clientForQueue(name: string){
	return {
		imports: [ConfigModule],
		name: 'RabbitMQ_'+name,
		useFactory: async (configService: ConfigService): Promise<ClientProvider> => ({
			transport: Transport.RMQ,
			options: {
				urls: [configService.get('RABBITMQ_URL')],
				queue: name
			},
		}),
		inject: [ConfigService],
	};
}

@Module({
	imports: [
		ConfigModule.forRoot(),
		ProjectsModule,
		MixingModule,
		AudiofilesModule,
		ModelsModule,
		DiarisationModule,
		SubtitlesModule,
		ConversionModule,
		ClientsModule.registerAsync([
			clientForQueue('media')
		]),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
