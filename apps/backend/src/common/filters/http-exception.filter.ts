import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';

import type { Request, Response } from 'express';

type ErrorResponseBody = {
	statusCode: number;
	message: string | string[];
	error?: string;
	timestamp: string;
	path: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(HttpExceptionFilter.name);

	catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		const exceptionResponse =
			exception instanceof HttpException
				? exception.getResponse()
				: 'Internal server error';

		let message: string | string[];
		let error: string | undefined;

		if (typeof exceptionResponse === 'string') {
			message = exceptionResponse;
		} else if (
			typeof exceptionResponse === 'object' &&
			exceptionResponse !== null
		) {
			const body = exceptionResponse as Record<string, unknown>;
			message =
				(body.message as string | string[] | undefined) ?? 'Error';
			error = body.error as string | undefined;
		} else {
			message = 'Internal server error';
		}

		if (status >= 500) {
			this.logger.error(
				`${request.method} ${request.url}`,
				exception instanceof Error
					? exception.stack
					: String(exception),
			);
		}

		const body: ErrorResponseBody = {
			statusCode: status,
			message,
			timestamp: new Date().toISOString(),
			path: request.url,
		};

		if (error) {
			body.error = error;
		}

		response.status(status).json(body);
	}
}
