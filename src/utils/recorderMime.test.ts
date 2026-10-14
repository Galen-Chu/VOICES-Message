import { describe, expect, it } from 'vitest';
import { pickRecorderMime, RECORDER_MIME_CANDIDATES, recorderAvailable } from './recorderMime';

describe('pickRecorderMime(候選探測)', () => {
  it('取第一個支援的候選(依優先序)', () => {
    const supported = new Set(['audio/webm;codecs=opus', 'audio/webm']);
    expect(pickRecorderMime(RECORDER_MIME_CANDIDATES, (m) => supported.has(m))).toBe(
      'audio/webm;codecs=opus',
    );
  });

  it('Safari 型環境:webm 皆不支援 → 落到 mp4', () => {
    const supported = new Set(['audio/mp4;codecs=mp4a.40.2', 'audio/mp4']);
    expect(pickRecorderMime(RECORDER_MIME_CANDIDATES, (m) => supported.has(m))).toBe(
      'audio/mp4;codecs=mp4a.40.2',
    );
  });

  it('全不支援 → null(呼叫端顯示不支援,不猜測)', () => {
    expect(pickRecorderMime(RECORDER_MIME_CANDIDATES, () => false)).toBeNull();
    expect(pickRecorderMime([], () => true)).toBeNull();
  });
});

describe('recorderAvailable(環境能力檢查)', () => {
  it('MediaRecorder 與 getUserMedia 皆在才算可用', () => {
    const ok = {
      MediaRecorder: class {},
      navigator: { mediaDevices: { getUserMedia: () => Promise.resolve({}) } },
    };
    expect(recorderAvailable(ok)).toBe(true);
    expect(recorderAvailable({ MediaRecorder: class {} })).toBe(false);
    expect(recorderAvailable({ navigator: { mediaDevices: {} } })).toBe(false);
    expect(recorderAvailable({})).toBe(false);
  });
});
