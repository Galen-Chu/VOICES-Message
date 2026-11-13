/**
 * 錄音記錄 metadata 存取(V1;紅線:音檔絕不落地——這裡只存描述性資料)。
 * 鏡像媒管庫 services/library.ts 模式:storage 可注入、防禦式解析(壞資料退回空清單、
 * 單筆壞只丟那筆)、永不拋例外;寫入失敗回 saveFailed讓 UI 誠實提示。
 * localStorage 鍵 = `voices-message:v1`(本產品內部鍵;跨產品一律走 family:* 契約鍵)。
 */
import { AUDIO_KIND_EXT, type AudioKind } from '../utils/audioKind';

/** localStorage 鍵(本產品內部鍵,版本化)。 */
export const RECORDINGS_STORAGE_KEY = 'voices-message:v1';

/** 上限:metadata 極輕,200 筆足夠長期使用,超出淘汰最舊。 */
export const RECORDINGS_MAX = 200;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface RecordingMeta {
  id: string;
  /** 標題=下載檔名主體(預設「錄音 M/D HH:mm」,可改)。 */
  title: string;
  /** MediaRecorder 實際產物的 MIME(如 audio/webm;codecs=opus)。 */
  mime: string;
  /** 音檔類型(展示用標籤;unknown 也可顯示)。 */
  kind: AudioKind;
  /** 實際收音秒數(暫停不計,見 recorderClock)。 */
  durationSec: number;
  sizeBytes: number;
  createdAt: number;
  /** 說明(選填,空字串=未填)。 */
  note: string;
}

interface RecordingsStorageShape {
  version: 1;
  recordings: RecordingMeta[];
}

const KNOWN_KINDS = new Set(Object.keys(AUDIO_KIND_EXT) as AudioKind[]);

function defaultStorage(): StorageLike | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null; // 隱私模式等情境:記錄僅存在記憶體
  }
}

function isRecordingMeta(v: unknown): v is RecordingMeta {
  if (!v || typeof v !== 'object') return false;
  const r = v as Partial<RecordingMeta>;
  return (
    typeof r.id === 'string' &&
    typeof r.title === 'string' &&
    typeof r.mime === 'string' &&
    typeof r.durationSec === 'number' &&
    typeof r.sizeBytes === 'number' &&
    typeof r.createdAt === 'number' &&
    typeof r.note === 'string' &&
    (typeof r.kind === 'string' && KNOWN_KINDS.has(r.kind as AudioKind))
  );
}

function parseStored(text: string | null): RecordingMeta[] {
  if (!text) return [];
  try {
    const data = JSON.parse(text) as Partial<RecordingsStorageShape>;
    if (data.version !== 1 || !Array.isArray(data.recordings)) return [];
    return data.recordings.filter(isRecordingMeta);
  } catch {
    return [];
  }
}

/** 寫入 storage;失敗(配額滿等)回 false、不拋。 */
function persist(recordings: readonly RecordingMeta[], storage: StorageLike | null): boolean {
  if (!storage) return true; // 無 storage=記憶體模式,非寫入失敗
  const shape: RecordingsStorageShape = { version: 1, recordings: [...recordings] };
  try {
    storage.setItem(RECORDINGS_STORAGE_KEY, JSON.stringify(shape));
    return true;
  } catch {
    return false;
  }
}

/** 載入錄音記錄(新→舊;損壞/不存在 → 空清單)。 */
export function loadRecordings(storage: StorageLike | null = defaultStorage()): RecordingMeta[] {
  if (!storage) return [];
  return parseStored(storage.getItem(RECORDINGS_STORAGE_KEY));
}

/** 新增一筆(最新在前;超量淘汰最舊);saveFailed=寫入失敗僅記憶體。 */
export function addRecording(
  meta: RecordingMeta,
  storage: StorageLike | null = defaultStorage(),
): { recordings: RecordingMeta[]; saveFailed: boolean } {
  const recordings = [meta, ...loadRecordings(storage)].slice(0, RECORDINGS_MAX);
  return { recordings, saveFailed: !persist(recordings, storage) };
}

/** 更新標題/說明(不存在=no-op);寫入失敗仍回傳記憶體版本。 */
export function updateRecording(
  id: string,
  patch: { title?: string; note?: string },
  storage: StorageLike | null = defaultStorage(),
): RecordingMeta[] {
  const recordings = loadRecordings(storage).map((r) =>
    r.id === id
      ? {
          ...r,
          ...(typeof patch.title === 'string' ? { title: patch.title } : {}),
          ...(typeof patch.note === 'string' ? { note: patch.note } : {}),
        }
      : r,
  );
  persist(recordings, storage);
  return recordings;
}

/** 刪除一筆(不存在=no-op)。 */
export function deleteRecording(
  id: string,
  storage: StorageLike | null = defaultStorage(),
): RecordingMeta[] {
  const recordings = loadRecordings(storage).filter((r) => r.id !== id);
  persist(recordings, storage);
  return recordings;
}
