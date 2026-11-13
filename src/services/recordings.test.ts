import { beforeEach, describe, expect, it } from 'vitest';
import {
  RECORDINGS_MAX,
  RECORDINGS_STORAGE_KEY,
  addRecording,
  deleteRecording,
  loadRecordings,
  updateRecording,
  type RecordingMeta,
  type StorageLike,
} from './recordings';

function makeMeta(overrides: Partial<RecordingMeta> = {}): RecordingMeta {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    title: '測試錄音',
    mime: 'audio/webm;codecs=opus',
    kind: 'webm',
    durationSec: 12,
    sizeBytes: 96_000,
    createdAt: Date.now(),
    note: '',
    ...overrides,
  };
}

class MemoryStorage implements StorageLike {
  map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}

describe('recordings service', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
  });

  it('空 storage → 空清單', () => {
    expect(loadRecordings(storage)).toEqual([]);
  });

  it('新增後可載回,新在前', () => {
    const a = makeMeta({ id: 'a', createdAt: 1000 });
    const b = makeMeta({ id: 'b', createdAt: 2000 });
    addRecording(a, storage);
    const { recordings } = addRecording(b, storage);
    expect(recordings.map((r) => r.id)).toEqual(['b', 'a']);
    expect(loadRecordings(storage).map((r) => r.id)).toEqual(['b', 'a']);
  });

  it('更新標題與說明;不存在 id=no-op', () => {
    addRecording(makeMeta({ id: 'a', note: '' }), storage);
    const updated = updateRecording('a', { title: '改名', note: '說明文字' }, storage);
    expect(updated[0]).toMatchObject({ id: 'a', title: '改名', note: '說明文字' });
    expect(loadRecordings(storage)[0].title).toBe('改名');
    const unchanged = updateRecording('nope', { title: 'x' }, storage);
    expect(unchanged).toHaveLength(1);
  });

  it('刪除指定筆;不存在=no-op', () => {
    addRecording(makeMeta({ id: 'a' }), storage);
    addRecording(makeMeta({ id: 'b' }), storage);
    expect(deleteRecording('a', storage).map((r) => r.id)).toEqual(['b']);
    expect(deleteRecording('ghost', storage)).toHaveLength(1);
  });

  it('超量淘汰最舊(上限 200)', () => {
    for (let i = 0; i < RECORDINGS_MAX + 3; i++) {
      addRecording(makeMeta({ id: `r${i}`, createdAt: i }), storage);
    }
    const recordings = loadRecordings(storage);
    expect(recordings).toHaveLength(RECORDINGS_MAX);
    expect(recordings[0].id).toBe(`r${RECORDINGS_MAX + 2}`);
    expect(recordings[recordings.length - 1].id).toBe('r3'); // r0–r2 被淘汰
  });

  it('防禦式解析:壞 JSON/版不符/單筆壞 → 退回過濾結果,不拋', () => {
    storage.map.set(RECORDINGS_STORAGE_KEY, '{{{');
    expect(loadRecordings(storage)).toEqual([]);
    storage.map.set(RECORDINGS_STORAGE_KEY, JSON.stringify({ version: 2, recordings: [] }));
    expect(loadRecordings(storage)).toEqual([]);
    // 故意摻壞 kind 的筆(繞過型別——storage 內容本就不受型別保證)
    const badKind = { ...makeMeta({ id: 'good2' }), kind: 'not-a-kind' } as unknown as RecordingMeta;
    storage.map.set(
      RECORDINGS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        recordings: [
          makeMeta({ id: 'good' }),
          { id: 'bad' }, // 缺欄位
          null,
          badKind,
        ],
      }),
    );
    expect(loadRecordings(storage).map((r) => r.id)).toEqual(['good']);
  });

  it('寫入失敗(丟例外)→ saveFailed=true,清單仍在記憶體', () => {
    const failing: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceeded');
      },
    };
    const { recordings, saveFailed } = addRecording(makeMeta({ id: 'x' }), failing);
    expect(saveFailed).toBe(true);
    expect(recordings.map((r) => r.id)).toEqual(['x']);
  });

  it('storage=null → 記憶體模式(load 空、寫入不報錯)', () => {
    expect(loadRecordings(null)).toEqual([]);
    const { saveFailed } = addRecording(makeMeta(), null);
    expect(saveFailed).toBe(false); // 無 storage=靜默記憶體模式,非失敗
  });
});
