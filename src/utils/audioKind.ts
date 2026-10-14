/**
 * 音檔類型偵測(純函式):MIME 前綴優先,缺漏或非 audio/* 時以副檔名 fallback。
 * 鏡像媒管庫 mediaKind 模式;供 V1 錄音機(辨識 MediaRecorder 產物)與音檔匯入使用。
 */
export type AudioKind =
  | 'webm' // MediaRecorder 常見(Chrome/Firefox)產物
  | 'mp4' // MediaRecorder Safari 產物
  | 'mpeg' // .mp3
  | 'wav'
  | 'ogg' // 含 opus
  | 'unknown';

const MIME_MAP: Array<[prefix: string, kind: AudioKind]> = [
  ['audio/webm', 'webm'],
  ['audio/mp4', 'mp4'],
  ['audio/mpeg', 'mpeg'],
  ['audio/mp3', 'mpeg'],
  ['audio/wav', 'wav'],
  ['audio/wave', 'wav'],
  ['audio/x-wav', 'wav'],
  ['audio/ogg', 'ogg'],
  ['audio/opus', 'ogg'],
];

const EXT_MAP: Record<string, AudioKind> = {
  webm: 'webm',
  m4a: 'mp4',
  mp4: 'mp4',
  mp3: 'mpeg',
  wav: 'wav',
  ogg: 'ogg',
  oga: 'ogg',
  opus: 'ogg',
};

/** MIME 前綴對應(僅接受 audio/*);非音檔 MIME 回 null,不用於內容判斷。 */
export function audioKindFromMime(mime: string): AudioKind | null {
  if (!mime.startsWith('audio/')) return null;
  for (const [prefix, kind] of MIME_MAP) {
    if (mime.startsWith(prefix)) return kind;
  }
  return null;
}

/** 副檔名 fallback(大小寫不拘;chrome 帶空 MIME 或 application/octet-stream 時用)。 */
export function audioKindFromFilename(filename: string): AudioKind {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return EXT_MAP[ext] ?? 'unknown';
}

/** 統一入口:MIME 優先,解不出再以副檔名;兩者皆無 → unknown。 */
export function detectAudioKind(mime: string, filename: string): AudioKind {
  return audioKindFromMime(mime) ?? audioKindFromFilename(filename);
}

/** 各類型的建議副檔名(下載/命名時用,與 EXT_MAP 對應)。 */
export const AUDIO_KIND_EXT: Record<AudioKind, string> = {
  webm: '.webm',
  mp4: '.m4a',
  mpeg: '.mp3',
  wav: '.wav',
  ogg: '.ogg',
  unknown: '',
};
