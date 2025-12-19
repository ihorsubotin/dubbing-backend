import { Global, Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { ActiveCurrentProject } from './guard/current-project';
import { ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';

@Global()
@Module({
	imports: [
		CacheModule.register({
			useFactory: async (configService: ConfigService) => {
				return {
					stores: [
						new KeyvRedis(configService.get('REDIS_URL')),
					],
				};
			},
		})
	],
	controllers: [ProjectsController],
	providers: [ProjectsService, ActiveCurrentProject],
	exports: [ProjectsService],
})
export class ProjectsModule {}
