/**
 * 顯示格式化純函式(V1):時長(mm:ss / h:mm:ss)、檔案大小(B/KB/MB/GB)、
 * 日期時間(M/D HH:mm,本機時區,鏡像文管庫 utils/date.ts 的 shortDateTimeLabel)。
 */

/** 秒 → 'm:ss'(<1 小時)或 'h:mm:ss';負值與 NaN 防禦為 '0:00'。 */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, '0');
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${ss}`;
  return `${m}:${ss}`;
}

/** bytes → 人類可讀(KB/MB 保留一位小數;<1024 B 不加小數)。 */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/** epoch ms → 'M/D HH:mm'(本機時區;錄音標題與記錄列表共用同一格式)。 */
export function formatDateTime(epochMs: number): string {
  const d = new Date(epochMs);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${d.getMonth() + 1}/${d.getDate()} ${hh}:${mm}`;
}
