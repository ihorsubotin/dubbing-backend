import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transformOptions: {
				exposeUnsetFields: false,
			},
		}),
	);
	app.setGlobalPrefix('/api');
	await app.listen(process.env.APP_PORT ?? 3000);
	Logger.log(`App is running on ${process.env.ORIGIN}:${process.env.APP_PORT}`);
}
bootstrap();
