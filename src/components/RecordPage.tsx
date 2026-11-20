/**
 * 編發器頁(V1,2026-11-20 前名「錄音機 Record」):狀態機 UI(idle/starting/recording ⇄ paused/error)+ 誠實降級。
 * 瀏覽器能力檢查在 render 時一次(recorderSupported);實際啟動的錯誤由 hook 狀態回報。
 * 停止後結果交 App 層(onRecordingDone)——存 metadata + 保留記憶體音檔給記錄頁。
 */
import { useState } from 'react';
import { RECORDER_ERROR_COPY, REC_COPY } from '../constants';
import { recorderSupported, useRecorder, type RecordingResult } from '../hooks/useRecorder';
import { formatDuration } from '../utils/format';

interface RecordPageProps {
  onRecordingDone: (result: RecordingResult) => void;
}

export default function RecordPage({ onRecordingDone }: RecordPageProps) {
  const rec = useRecorder();
  const [supported] = useState(() => recorderSupported());

  const statusLabel =
    rec.status === 'recording'
      ? REC_COPY.statusRecording
      : rec.status === 'paused'
        ? REC_COPY.statusPaused
        : REC_COPY.statusIdle;

  const onStop = async () => {
    const result = await rec.stop();
    if (result) onRecordingDone(result);
  };

  return (
    <div>
      <div className="t-page-title">{REC_COPY.pageTitle}</div>
      <div className="t-page-desc" style={{ margin: '4px 0 20px' }}>{REC_COPY.pageDesc}</div>

      <div className="card" style={{ padding: 22, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
          <span
            className="t-sec-title"
            style={{
              color: rec.status === 'recording' ? 'var(--error)' : 'var(--text-sub)',
            }}
          >
            {statusLabel}
          </span>
          <span className="t-stat t-num" aria-label="已錄時間">
            {formatDuration(rec.elapsed)}
          </span>
        </div>

        {supported ? (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {(rec.status === 'idle' || rec.status === 'starting') && (
              <button type="button" className="btn btn-primary" onClick={rec.start} disabled={rec.status === 'starting'}>
                {rec.status === 'starting' ? REC_COPY.startingBtn : `🎙️ ${REC_COPY.startBtn}`}
              </button>
            )}
            {(rec.status === 'recording' || rec.status === 'paused') && (
              <>
                <button type="button" className="btn btn-outline" onClick={rec.status === 'paused' ? rec.resume : rec.pause}>
                  {rec.status === 'paused' ? `▶️ ${REC_COPY.resumeBtn}` : `⏸ ${REC_COPY.pauseBtn}`}
                </button>
                <button type="button" className="btn btn-accent" onClick={onStop}>
                  ⏹ {REC_COPY.stopBtn}
                </button>
              </>
            )}
          </div>
        ) : (
          <div
            role="alert"
            className="t-sub"
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: 'var(--surface-soft)',
              color: 'var(--text-sub)',
            }}
          >
            <strong style={{ color: 'var(--text-main)' }}>{REC_COPY.errorTitle}:</strong>
            {RECORDER_ERROR_COPY['not-supported']}
          </div>
        )}

        {rec.status === 'error' && rec.errorCode && (
          <div
            role="alert"
            className="t-sub"
            style={{
              marginTop: 14,
              padding: '12px 14px',
              borderRadius: 10,
              background: 'var(--surface-soft)',
              color: 'var(--text-sub)',
            }}
          >
            <strong style={{ color: 'var(--text-main)' }}>{REC_COPY.errorTitle}:</strong>
            {RECORDER_ERROR_COPY[rec.errorCode]}{' '}
            <button type="button" className="btn btn-ghost" onClick={rec.start} style={{ marginLeft: 6 }}>
              {REC_COPY.retryBtn}
            </button>
          </div>
        )}
      </div>

      <div
        className="t-sub"
        style={{
          padding: '10px 12px',
          borderRadius: 10,
          background: 'var(--surface-soft)',
        }}
      >
        🔒 {REC_COPY.honestNote}
      </div>
    </div>
  );
}
