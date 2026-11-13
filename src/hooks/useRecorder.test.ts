// @vitest-environment jsdom
/** useRecorder 狀態機測試:能力缺失誠實降級 + FakeMediaRecorder 全流程(錄/暫停/續錄/停止)。 */
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useRecorder, type RecordingResult } from './useRecorder';

interface FakeMediaRecorderEvent {
  data?: Blob;
}

class FakeMediaRecorder {
  static isTypeSupported(m: string): boolean {
    return m.startsWith('audio/webm');
  }
  state: 'inactive' | 'recording' | 'paused' = 'inactive';
  ondataavailable: ((e: FakeMediaRecorderEvent) => void) | null = null;
  onstop: (() => void) | null = null;
  onerror: (() => void) | null = null;
  start(): void {
    this.state = 'recording';
  }
  pause(): void {
    this.state = 'paused';
  }
  resume(): void {
    this.state = 'recording';
  }
  stop(): void {
    this.state = 'inactive';
    this.ondataavailable?.({ data: new Blob(['fake-audio']) });
    this.onstop?.();
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useRecorder:能力缺失', () => {
  it('無 MediaRecorder → start 落 error/not-supported,不拋', async () => {
    const { result } = renderHook(() => useRecorder());
    await act(async () => {
      await result.current.start();
    });
    expect(result.current.status).toBe('error');
    expect(result.current.errorCode).toBe('not-supported');
  });

  it('getUserMedia 拒絕(NotAllowedError)→ error/denied', async () => {
    vi.stubGlobal('MediaRecorder', FakeMediaRecorder);
    const getUserMedia = vi.fn(async () => {
      const e = new Error('denied');
      e.name = 'NotAllowedError';
      throw e;
    });
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } });
    const { result } = renderHook(() => useRecorder());
    await act(async () => {
      await result.current.start();
    });
    expect(result.current.status).toBe('error');
    expect(result.current.errorCode).toBe('denied');
    expect(getUserMedia).toHaveBeenCalledWith({ audio: true });
  });
});

describe('useRecorder:錄音全流程', () => {
  function stubHappyPath() {
    const track = { stop: vi.fn() };
    const getUserMedia = vi.fn(async () => ({ getTracks: () => [track] }));
    vi.stubGlobal('MediaRecorder', FakeMediaRecorder);
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } });
    return { getUserMedia, track };
  }

  it('start→pause→resume→stop:狀態流轉與結果(blob/mime/duration)', async () => {
    const { getUserMedia } = stubHappyPath();
    const { result } = renderHook(() => useRecorder());

    await act(async () => {
      await result.current.start();
    });
    expect(result.current.status).toBe('recording');
    expect(result.current.mime).toBe('audio/webm;codecs=opus');
    expect(getUserMedia).toHaveBeenCalledTimes(1);

    act(() => result.current.pause());
    expect(result.current.status).toBe('paused');

    act(() => result.current.resume());
    expect(result.current.status).toBe('recording');

    let res: RecordingResult | null = null;
    await act(async () => {
      res = await result.current.stop();
    });
    expect(result.current.status).toBe('idle');
    expect(res).not.toBeNull();
    expect(res!.blob.type).toBe('audio/webm;codecs=opus');
    expect(res!.durationSec).toBeGreaterThanOrEqual(0);
  });

  it('stop 在 idle 狀態=no-op 回 null(防連點)', async () => {
    stubHappyPath();
    const { result } = renderHook(() => useRecorder());
    let res: RecordingResult | null = { blob: new Blob(), mime: '', durationSec: 0 };
    await act(async () => {
      res = await result.current.stop();
    });
    expect(res).toBeNull();
  });

  it('error 狀態可清除重試(clearError → idle)', async () => {
    const { result } = renderHook(() => useRecorder()); // 無 MediaRecorder
    await act(async () => {
      await result.current.start();
    });
    expect(result.current.status).toBe('error');
    act(() => result.current.clearError());
    expect(result.current.status).toBe('idle');
    expect(result.current.errorCode).toBeNull();
  });
});
