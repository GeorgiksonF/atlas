import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type {
	AuthenticatedRequest,
	AuthenticatedUser,
} from '../types/authenticated-user';

/**
 * Injects the authenticated user from the request.
 * Use on routes protected by JwtAuthGuard (global by default).
 *
 * @example @CurrentUser() user: AuthenticatedUser
 * @example @CurrentUser('userId') userId: string
 */
export const extractCurrentUser = (
	data: keyof AuthenticatedUser | undefined,
	ctx: ExecutionContext,
): AuthenticatedUser | AuthenticatedUser[keyof AuthenticatedUser] => {
	const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
	const user = request.user;

	return data ? user[data] : user;
};

export const CurrentUser = createParamDecorator(extractCurrentUser);
