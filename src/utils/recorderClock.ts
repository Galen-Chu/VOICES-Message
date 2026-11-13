/**
 * 錄音計時純函式(V1):以「錄音區段」累計實際收音時間——暫停期間不計。
 * useRecorder 維護區段陣列(開錄 push {start}、暫停 close、續錄再 push),
 * elapsed 只在 recording 狀態更新(paused 時最後一段已關閉,數字自然凍結)。
 */

export interface ClockSegment {
  start: number;
  /** 未定義=進行中(以 now 收尾)。 */
  end?: number;
}

/** 已收音秒數:各段 (end ?? now) - start 之總和,向下取整。 */
export function elapsedSeconds(segments: ReadonlyArray<ClockSegment>, now: number): number {
  let total = 0;
  for (const seg of segments) {
    const end = typeof seg.end === 'number' ? seg.end : now;
    if (end > seg.start) total += end - seg.start;
  }
  return Math.floor(total / 1000);
}
