import { describe, expect, it } from 'vitest';
import { elapsedSeconds } from './recorderClock';

describe('elapsedSeconds', () => {
  it('空區段為 0', () => {
    expect(elapsedSeconds([], 10_000)).toBe(0);
  });

  it('關閉區段累加,暫停空檔不計', () => {
    // 0–3s 收音、3–8s 暫停、8–10s 收音 → 實際 5s
    const segs = [
      { start: 0, end: 3000 },
      { start: 8000, end: 10_000 },
    ];
    expect(elapsedSeconds(segs, 20_000)).toBe(5);
  });

  it('進行中區段以 now 收尾', () => {
    const segs = [{ start: 0 }, { start: 5000, end: 7000 }];
    expect(elapsedSeconds(segs, 12_000)).toBe(14); // 12s + 2s
  });

  it('end 早於 start 的壞區段跳過不連坐', () => {
    const segs = [
      { start: 0, end: 2000 },
      { start: 9000, end: 1000 }, // 防禦:時鐘異常倒退
    ];
    expect(elapsedSeconds(segs, 20_000)).toBe(2);
  });
});
