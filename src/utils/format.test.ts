import { describe, expect, it } from 'vitest';
import { formatBytes, formatDateTime, formatDuration } from './format';

describe('formatDuration', () => {
  it('零與基本秒數', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(9)).toBe('0:09');
    expect(formatDuration(65)).toBe('1:05');
  });

  it('滿一小時切 h:mm:ss', () => {
    expect(formatDuration(3600)).toBe('1:00:00');
    expect(formatDuration(3671)).toBe('1:01:11');
  });

  it('負值/NaN/Infinity 防禦為 0:00', () => {
    expect(formatDuration(-3)).toBe('0:00');
    expect(formatDuration(Number.NaN)).toBe('0:00');
    expect(formatDuration(Number.POSITIVE_INFINITY)).toBe('0:00');
  });
});

describe('formatBytes', () => {
  it('各級距與進位', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(1536 * 1024)).toBe('1.5 MB');
    expect(formatBytes(2 * 1024 * 1024 * 1024)).toBe('2.0 GB');
  });

  it('負值/NaN 防禦為 0 B', () => {
    expect(formatBytes(-1)).toBe('0 B');
    expect(formatBytes(Number.NaN)).toBe('0 B');
  });
});

describe('formatDateTime', () => {
  it('M/D HH:mm(補零時分)', () => {
    const d = new Date(2026, 10, 13, 9, 5); // 2026-11-13 09:05(本機時區)
    expect(formatDateTime(d.getTime())).toBe('11/13 09:05');
  });

  it('兩位數時分不重複補零', () => {
    const d = new Date(2026, 0, 2, 14, 30);
    expect(formatDateTime(d.getTime())).toBe('1/2 14:30');
  });
});
