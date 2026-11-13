/**
 * 殼層(V1 三頁籤):聲管 Dashboard / 錄音機 Record / 錄音記錄 Records。
 * hash 深連結(#record/#records,未知落 Dashboard;書籤與家族連結入口)。
 * 狀態分工:records=metadata(落地 services/recordings)、sessions=本工作階段音檔
 * (blob+object URL 僅記憶體——紅線:音檔絕不落地;刪除時 revoke URL)。
 * 切頁籤不清洗 sessions:錄完到記錄頁播放/下載,回錄音頁再錄,音檔都在(同分頁記憶體)。
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Dashboard from './components/Dashboard';
import RecordPage from './components/RecordPage';
import RecordingsPage, { type SessionAudio } from './components/RecordingsPage';
import Sidebar from './components/Sidebar';
import { NOTICE_COPY } from './constants';
import type { RecordingResult } from './hooks/useRecorder';
import {
  addRecording,
  deleteRecording,
  loadRecordings,
  updateRecording,
  type RecordingMeta,
} from './services/recordings';
import type { TabKey } from './types';
import { detectAudioKind } from './utils/audioKind';
import { formatDateTime } from './utils/format';

const TAB_KEYS: readonly TabKey[] = ['dashboard', 'record', 'records'];

function tabFromHash(): TabKey {
  const hash = window.location.hash.replace(/^#/, '');
  return (TAB_KEYS as readonly string[]).includes(hash) ? (hash as TabKey) : 'dashboard';
}

export default function App() {
  const [tab, setTab] = useState<TabKey>(() => tabFromHash());
  const [records, setRecords] = useState<RecordingMeta[]>(() => loadRecordings());
  const [sessions, setSessions] = useState<Record<string, SessionAudio>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | null>(null);

  const showNotice = useCallback((msg: string) => {
    setNotice(msg);
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 3000);
  }, []);

  useEffect(
    () => () => {
      if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
    },
    [],
  );

  // hash 深連結:書籤/家族連結以 #record 等開啟時切到對應頁籤
  useEffect(() => {
    const onHashChange = () => setTab(tabFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const goTab = useCallback((next: TabKey) => {
    setTab(next);
    const target = next === 'dashboard' ? window.location.pathname + window.location.search : `#${next}`;
    window.history.replaceState(null, '', target);
  }, []);

  const handleRecordingDone = useCallback(
    (result: RecordingResult) => {
      const meta: RecordingMeta = {
        id: crypto.randomUUID(),
        title: `錄音 ${formatDateTime(Date.now())}`,
        mime: result.mime,
        kind: detectAudioKind(result.mime, ''),
        durationSec: result.durationSec,
        sizeBytes: result.blob.size,
        createdAt: Date.now(),
        note: '',
      };
      const { recordings, saveFailed } = addRecording(meta);
      setRecords(recordings);
      setSessions((prev) => ({
        ...prev,
        [meta.id]: { blob: result.blob, url: URL.createObjectURL(result.blob) },
      }));
      showNotice(saveFailed ? NOTICE_COPY.saveFailed : NOTICE_COPY.saved);
    },
    [showNotice],
  );

  const handlePatch = useCallback((id: string, patch: { title?: string; note?: string }) => {
    setRecords(updateRecording(id, patch));
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      setRecords(deleteRecording(id));
      setSessions((prev) => {
        const entry = prev[id];
        if (entry) URL.revokeObjectURL(entry.url);
        const next = { ...prev };
        delete next[id];
        return next;
      });
      showNotice(NOTICE_COPY.deleted);
    },
    [showNotice],
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activeTab={tab} onTabChange={goTab} />
      <main className="app-main" style={{ flex: 1, minWidth: 0 }}>
        {tab === 'dashboard' && <Dashboard onGoRecord={() => goTab('record')} />}
        {tab === 'record' && <RecordPage onRecordingDone={handleRecordingDone} />}
        {tab === 'records' && (
          <RecordingsPage records={records} sessions={sessions} onPatch={handlePatch} onDelete={handleDelete} />
        )}
      </main>
      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
    </div>
  );
}
