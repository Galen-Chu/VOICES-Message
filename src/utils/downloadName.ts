/**
 * 下載檔名純函式(V1):錄音標題→安全檔名(Windows/macOS 非法字元以空格取代、
 * 連續空白收斂),再接格式副檔名(webm/.m4a/…,見 audioKind 的 AUDIO_KIND_EXT)。
 * 標題清空後防禦為「錄音」——下載永遠有可用的檔名。
 */

const ILLEGAL = /[\\/:*?"<>|\u0000-\u001f]/g;

/** 標題 → 安全檔名主體(非法字元→空格、空白收斂、trim;空→「錄音」)。 */
export function sanitizeRecordingTitle(title: string): string {
  const cleaned = title.replace(ILLEGAL, ' ').replace(/\s+/g, ' ').trim();
  return cleaned || '錄音';
}

/** 安全檔名主體 + 副檔名(ext 含不含前導點皆可;無副檔名=僅主體)。 */
export function buildDownloadFilename(title: string, ext: string): string {
  const base = sanitizeRecordingTitle(title);
  if (!ext) return base;
  return `${base}${ext.startsWith('.') ? ext : `.${ext}`}`;
}
