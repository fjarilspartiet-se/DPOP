// src/utils/format.test.ts

import { formatDate } from './format';

describe('formatDate', () => {
  it('formats date in Swedish format', () => {
    const date = new Date('2024-10-26');
    expect(formatDate(date)).toBe('2024-10-26');
  });
});
