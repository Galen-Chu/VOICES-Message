/**
 * 錄音記錄頁(V1):metadata 清單(新→舊)。本工作階段的錄音附記憶體音檔(播放/下載);
 * 重新整理後僅存 metadata——誠實標示「音檔已不在此工作階段」而非假裝可播。
 * 標題/說明 inline 編輯(onBlur 落地,避免逐鍵寫入);刪除走確認 Modal(不可再生內容慣例)。
 */
import { useState } from 'react';
import { RECORDS_COPY } from '../constants';
import type { RecordingMeta } from '../services/recordings';
import { AUDIO_KIND_EXT } from '../utils/audioKind';
import { buildDownloadFilename } from '../utils/downloadName';
import { formatBytes, formatDateTime, formatDuration } from '../utils/format';
import ConfirmModal from './ConfirmModal';

/** 本工作階段仍在記憶體的音檔(blob 僅供型別完整,url 供播放/下載)。 */
export interface SessionAudio {
  blob: Blob;
  url: string;
}

interface RecordingsPageProps {
  records: RecordingMeta[];
  sessions: Record<string, SessionAudio>;
  onPatch: (id: string, patch: { title?: string; note?: string }) => void;
  onDelete: (id: string) => void;
}

export default function RecordingsPage({ records, sessions, onPatch, onDelete }: RecordingsPageProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const pendingDelete = records.find((r) => r.id === pendingDeleteId) ?? null;

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>{RECORDS_COPY.pageTitle}</div>
      <div style={{ fontSize: 12.5, color: 'var(--text-weak)', margin: '4px 0 20px' }}>{RECORDS_COPY.pageDesc}</div>

      <div
        style={{
          padding: '10px 12px',
          borderRadius: 10,
          background: 'var(--surface-soft)',
          fontSize: 12,
          color: 'var(--text-weak)',
          lineHeight: 1.7,
          marginBottom: 16,
        }}
      >
        {RECORDS_COPY.honestTitle}:{RECORDS_COPY.honestDesc}
      </div>

      {records.length === 0 ? (
        <div className="card" style={{ padding: 22, textAlign: 'center' }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
            {RECORDS_COPY.emptyTitle}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-weak)' }}>{RECORDS_COPY.emptyDesc}</div>
        </div>
      ) : (
        records.map((r) => {
          const session = sessions[r.id];
          return (
            <div key={r.id} className="card" style={{ padding: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                <input
                  className="text-input"
                  defaultValue={r.title}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (v && v !== r.title) onPatch(r.id, { title: v });
                  }}
                  aria-label="錄音標題"
                  style={{ fontWeight: 700, flex: 1 }}
                />
                {session && <span className="pill pill-brand">本工作階段</span>}
                <button type="button" className="btn btn-ghost" onClick={() => setPendingDeleteId(r.id)}>
                  {RECORDS_COPY.deleteBtn}
                </button>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-weak)', marginBottom: 10, fontVariantNumeric: 'tabular-nums' }}>
                {formatDateTime(r.createdAt)} · {RECORDS_COPY.kindLabel[r.kind]} · {formatDuration(r.durationSec)} ·{' '}
                {formatBytes(r.sizeBytes)}
              </div>
              {session ? (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption -- 錄音無字幕軌,控制列自帶替代操作 */}
                  <audio controls src={session.url} style={{ flex: 1, minWidth: 240, height: 36 }} />
                  <a
                    className="btn btn-outline"
                    href={session.url}
                    download={buildDownloadFilename(r.title, AUDIO_KIND_EXT[r.kind])}
                  >
                    ⬇ {RECORDS_COPY.download}
                  </a>
                </div>
              ) : (
                <div style={{ fontSize: 11.5, color: 'var(--text-faint)', marginBottom: 10 }}>
                  {RECORDS_COPY.audioUnavailable}
                </div>
              )}
              <input
                className="text-input"
                defaultValue={r.note}
                placeholder={RECORDS_COPY.notePlaceholder}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v !== r.note) onPatch(r.id, { note: v });
                }}
                aria-label="錄音說明"
              />
            </div>
          );
        })
      )}

      {pendingDelete && (
        <ConfirmModal
          title={RECORDS_COPY.confirmDeleteTitle}
          desc={RECORDS_COPY.confirmDeleteDesc}
          confirmLabel={RECORDS_COPY.confirmDelete}
          cancelLabel={RECORDS_COPY.confirmCancel}
          onConfirm={() => {
            onDelete(pendingDelete.id);
            setPendingDeleteId(null);
          }}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
}
