// tests/unit/Member.test.ts

import { createMockContext, MockContext } from '../utils/test-utils';

let mockCtx: MockContext;

beforeEach(() => {
  mockCtx = createMockContext();
});

describe('Member', () => {
  test('should create new member', async () => {
    const member = {
      id: '1',
      email: 'test@test.com',
      name: 'Test User',
      passwordHash: 'hashedpassword',
      role: 'MEMBER',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockCtx.prisma.member.create.mockResolvedValue(member);

    await expect(mockCtx.prisma.member.create({
      data: member
    })).resolves.toEqual(member);
  });
});
