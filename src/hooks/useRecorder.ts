/**
 * 錄音狀態機(V1;全專案唯一碰 MediaRecorder/getUserMedia 的層,其餘皆純邏輯)。
 * 狀態:idle → starting → recording ⇄ paused →(stop)→ idle;啟動失敗 → error(含錯誤碼)。
 * 計時走 recorderClock 區段(暫停不計);停止以 Promise 回傳結果(blob 僅記憶體——
 * 紅線:音檔絕不落地,落地交由 services/recordings 存 metadata)。
 * 卸載清理:停用麥克風軌 + 停止錄音器。
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RecorderErrorCode } from '../types';
import { micErrorToCode } from '../utils/recorderErrors';
import { pickRecorderMime, RECORDER_MIME_CANDIDATES, recorderAvailable } from '../utils/recorderMime';
import { elapsedSeconds, type ClockSegment } from '../utils/recorderClock';

export type RecorderStatus = 'idle' | 'starting' | 'recording' | 'paused' | 'error';

export interface RecordingResult {
  blob: Blob;
  mime: string;
  /** 實際收音秒數(暫停期間不計)。 */
  durationSec: number;
}

/** 瀏覽器是否具備錄音能力(MediaRecorder+getUserMedia 皆在)。 */
export function recorderSupported(): boolean {
  return recorderAvailable(globalThis);
}

export function useRecorder() {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [errorCode, setErrorCode] = useState<RecorderErrorCode | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [mime, setMime] = useState('');

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const segmentsRef = useRef<ClockSegment[]>([]);
  const chunksRef = useRef<Blob[]>([]);
  const stopResolveRef = useRef<((r: RecordingResult) => void) | null>(null);
  const stopRejectRef = useRef<((e: unknown) => void) | null>(null);

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const fail = useCallback((code: RecorderErrorCode) => {
    releaseStream();
    setStatus('error');
    setErrorCode(code);
  }, [releaseStream]);

  /** 開始錄音(idle/error 以外 no-op;啟動失敗只設狀態不拋)。 */
  const start = useCallback(async () => {
    if (status !== 'idle' && status !== 'error') return;
    setStatus('starting');
    if (!recorderSupported()) {
      fail('not-supported');
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      fail(micErrorToCode(err));
      return;
    }
    streamRef.current = stream;
    const picked = pickRecorderMime(RECORDER_MIME_CANDIDATES, (m) =>
      MediaRecorder.isTypeSupported(m),
    );
    if (!picked) {
      fail('not-supported');
      return;
    }
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, { mimeType: picked });
    } catch {
      fail('not-supported');
      return;
    }
    recorderRef.current = recorder;
    chunksRef.current = [];
    segmentsRef.current = [{ start: Date.now() }];
    recorder.ondataavailable = (e: BlobEvent) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: picked });
      const durationSec = elapsedSeconds(segmentsRef.current, Date.now());
      releaseStream();
      setStatus('idle');
      setMime(picked);
      stopResolveRef.current?.({ blob, mime: picked, durationSec });
      stopResolveRef.current = null;
      stopRejectRef.current = null;
    };
    recorder.onerror = () => {
      releaseStream();
      setStatus('error');
      setErrorCode('unknown');
      stopRejectRef.current?.(new Error('MediaRecorder error'));
      stopResolveRef.current = null;
      stopRejectRef.current = null;
    };
    recorder.start();
    setElapsed(0);
    setMime(picked);
    setStatus('recording');
  }, [fail, status]);

  /** 暫停(recording 以外 no-op):關閉當前區段,計時凍結。 */
  const pause = useCallback(() => {
    const recorder = recorderRef.current;
    if (status !== 'recording' || !recorder || recorder.state !== 'recording') return;
    recorder.pause();
    const now = Date.now();
    const segs = segmentsRef.current;
    const last = segs[segs.length - 1];
    if (last && last.end === undefined) last.end = now;
    setElapsed(elapsedSeconds(segmentsRef.current, now));
    setStatus('paused');
  }, [status]);

  /** 續錄(paused 以外 no-op):開新區段。 */
  const resume = useCallback(() => {
    const recorder = recorderRef.current;
    if (status !== 'paused' || !recorder || recorder.state !== 'paused') return;
    recorder.resume();
    segmentsRef.current.push({ start: Date.now() });
    setStatus('recording');
  }, [status]);

  /** 停止並取得結果(recording/paused 以外回 null);錄音器錯誤時 reject。 */
  const stop = useCallback((): Promise<RecordingResult | null> => {
    const recorder = recorderRef.current;
    if ((status !== 'recording' && status !== 'paused') || !recorder || recorder.state === 'inactive') {
      return Promise.resolve(null);
    }
    const now = Date.now();
    const segs = segmentsRef.current;
    const last = segs[segs.length - 1];
    if (last && last.end === undefined) last.end = now;
    setElapsed(elapsedSeconds(segmentsRef.current, now));
    return new Promise<RecordingResult>((resolve, reject) => {
      stopResolveRef.current = resolve;
      stopRejectRef.current = reject;
      recorder.stop();
    });
  }, [status]);

  /** 清除錯誤回到 idle(重試入口)。 */
  const clearError = useCallback(() => {
    if (status !== 'error') return;
    setStatus('idle');
    setErrorCode(null);
  }, [status]);

  // 計時:僅 recording 狀態每 250ms 重算(paused 時最後區段已關閉,數字凍結)
  useEffect(() => {
    if (status !== 'recording') return;
    const id = window.setInterval(() => {
      setElapsed(elapsedSeconds(segmentsRef.current, Date.now()));
    }, 250);
    return () => window.clearInterval(id);
  }, [status]);

  // 卸載清理:進行中的錄音直接釋放(不產出結果——元件不在了,結果無人接)
  useEffect(() => {
    return () => {
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== 'inactive') recorder.stop();
      recorderRef.current = null;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  return { status, errorCode, elapsed, mime, start, pause, resume, stop, clearError };
}
