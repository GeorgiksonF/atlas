import { ExecutionContext } from '@nestjs/common';

import { extractCurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';

const createMockContext = (user: AuthenticatedUser): ExecutionContext =>
	({
		switchToHttp: () => ({
			getRequest: () => ({ user }),
		}),
	}) as ExecutionContext;

describe('extractCurrentUser', () => {
	const user: AuthenticatedUser = {
		userId: 'user-1',
		email: 'test@example.com',
	};

	it('returns the full user when no property is requested', () => {
		const ctx = createMockContext(user);

		expect(extractCurrentUser(undefined, ctx)).toEqual(user);
	});

	it('returns userId when requested', () => {
		const ctx = createMockContext(user);

		expect(extractCurrentUser('userId', ctx)).toBe('user-1');
	});

	it('returns email when requested', () => {
		const ctx = createMockContext(user);

		expect(extractCurrentUser('email', ctx)).toBe('test@example.com');
	});
});
