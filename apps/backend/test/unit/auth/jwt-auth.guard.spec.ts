import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';

describe('JwtAuthGuard', () => {
	const reflector = {
		getAllAndOverride: jest.fn(),
	} as unknown as Reflector;

	const guard = new JwtAuthGuard(reflector);

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('allows public routes without passport validation', () => {
		const getAllAndOverride = jest
			.spyOn(reflector, 'getAllAndOverride')
			.mockReturnValue(true);

		const context = {
			getHandler: () => ({}),
			getClass: () => ({}),
		} as ExecutionContext;

		expect(guard.canActivate(context)).toBe(true);
		expect(getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
	});
});
