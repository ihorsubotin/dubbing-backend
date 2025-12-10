import { Injectable, NestMiddleware } from "@nestjs/common";
import { Mutex } from "async-mutex";
import { NextFunction } from "express";

@Injectable()
export class MutexMiddleware implements NestMiddleware {
	private mutex = new Mutex();
	async use(req: Request, res: Response, next: NextFunction) {
		const release = await this.mutex.acquire();
		try {
			await next();
		} finally {
			release();
		}
	}
}