import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { MutexMiddleware } from './projects/middleware/single-project';

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
	app.enableCors({
	    origin: [
		    'http://localhost:5173',     
		    'http://localhost:5174',   
		    'http://localhost:3000',    
		    process.env.ORIGIN
	    ],
	    credentials: true,         
	    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	    allowedHeaders: ['Content-Type', 'Authorization', 'X-Site-Language'],
	 });
	app.setGlobalPrefix('/api', {exclude: ['internal/*param']});
	await app.listen(process.env.APP_PORT ?? 3000);
	Logger.log(`App is running on ${process.env.ORIGIN}:${process.env.APP_PORT}`);
}
bootstrap();
