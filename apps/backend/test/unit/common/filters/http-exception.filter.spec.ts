import {
	ArgumentsHost,
	BadRequestException,
	HttpStatus,
	NotFoundException,
} from '@nestjs/common';

import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';

const createMockHost = (url = '/test'): ArgumentsHost => {
	const json = jest.fn();
	const status = jest.fn(() => ({ json }));

	return {
		switchToHttp: () => ({
			getResponse: () => ({ status, json }),
			getRequest: () => ({ method: 'GET', url }),
		}),
	} as unknown as ArgumentsHost;
};

describe('HttpExceptionFilter', () => {
	const filter = new HttpExceptionFilter();

	it('formats HttpException with object response', () => {
		const host = createMockHost('/portfolios/1');
		const response = host.switchToHttp().getResponse<{
			status: jest.Mock;
			json: jest.Mock;
		}>();

		filter.catch(new NotFoundException('Portfolio not found'), host);

		expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
		expect(response.json).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: HttpStatus.NOT_FOUND,
				message: 'Portfolio not found',
				path: '/portfolios/1',
				timestamp: expect.any(String) as string,
			}),
		);
	});

	it('formats validation errors with message array', () => {
		const host = createMockHost('/transactions');
		const response = host.switchToHttp().getResponse<{
			status: jest.Mock;
			json: jest.Mock;
		}>();

		filter.catch(
			new BadRequestException({
				message: ['price must be positive'],
				error: 'Bad Request',
			}),
			host,
		);

		expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
		expect(response.json).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: HttpStatus.BAD_REQUEST,
				message: ['price must be positive'],
				error: 'Bad Request',
			}),
		);
	});

	it('formats unknown errors as 500', () => {
		const host = createMockHost();
		const response = host.switchToHttp().getResponse<{
			status: jest.Mock;
			json: jest.Mock;
		}>();

		filter.catch(new Error('unexpected'), host);

		expect(response.status).toHaveBeenCalledWith(
			HttpStatus.INTERNAL_SERVER_ERROR,
		);
		expect(response.json).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal server error',
			}),
		);
	});
});
