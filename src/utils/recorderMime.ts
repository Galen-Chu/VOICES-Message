/**
 * MediaRecorder 錄音格式選擇(純函式,供 V1 錄音機):
 * 各瀏覽器支援的音訊容器不同(Chrome/Firefox=webm、Safari=mp4),
 * 以候選清單逐一探測 `MediaRecorder.isTypeSupported`,取第一個可用者。
 * isTypeSupported 以函式注入,保持純邏輯可測(瀏覽器能力不得進測試)。
 */

/** 候選優先序:壓縮率與相容性兼顧;webm/opus 最普遍,Safari 落到 mp4。 */
export const RECORDER_MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4;codecs=mp4a.40.2',
  'audio/mp4',
  'audio/ogg;codecs=opus',
  'audio/mpeg',
] as const;

/** 回第一個 isSupported 回 true 的候選;全不支援回 null(呼叫端顯示不支援提示)。 */
export function pickRecorderMime(
  candidates: readonly string[] = RECORDER_MIME_CANDIDATES,
  isSupported: (mime: string) => boolean,
): string | null {
  for (const mime of candidates) {
    if (isSupported(mime)) return mime;
  }
  return null;
}

/** 判斷瀏覽器是否具備錄音能力(MediaRecorder+getUserMedia 皆在;以注入避免耦合全域)。 */
export function recorderAvailable(g: {
  MediaRecorder?: unknown;
  navigator?: { mediaDevices?: { getUserMedia?: unknown } };
}): boolean {
  return typeof g.MediaRecorder === 'function' && typeof g.navigator?.mediaDevices?.getUserMedia === 'function';
}
