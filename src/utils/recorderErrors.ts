/**
 * 麥克風錯誤分類純函式(V1):getUserMedia/MediaRecorder 的例外 → 有限錯誤碼,
 * UI 對每碼給可行動文案(不可收斂成 generic,家族 UIUX 慣例)。
 * 錯誤碼集合見 types.ts RecorderErrorCode。
 */
import type { RecorderErrorCode } from '../types';

const NO_DEVICE_NAMES = new Set([
  'NotFoundError',
  'DevicesNotFoundError',
  'OverconstrainedError',
  'NotReadableError', // 裝置存在但取不到(常見=被其他應用占用)
  'TrackStartError',
]);

/** 例外 → 錯誤碼;無法辨識的例外誠實落 unknown(不猜原因)。 */
export function micErrorToCode(err: unknown): RecorderErrorCode {
  const name = (err as { name?: unknown } | null | undefined)?.name;
  if (typeof name !== 'string') return 'unknown';
  if (name === 'NotAllowedError' || name === 'SecurityError' || name === 'PermissionDeniedError') {
    return 'denied';
  }
  if (NO_DEVICE_NAMES.has(name)) return 'no-device';
  return 'unknown';
}
