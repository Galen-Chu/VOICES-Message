/**
 * 聲管 Dashboard(V0 落地頁延續 + V1 錄音入口):狀態/定位/紅線/路線/家族。
 * 內容文案集中 constants.ts(VOICES_COPY);路線與家族資料為元件本地靜態資料。
 */
import { VOICES_COPY } from '../constants';

const ROADMAP: Array<{ phase: string; title: string; desc: string }> = [
  { phase: 'V0 ✅', title: '骨架與設計文件', desc: 'repo、V-PLAN、CI/Pages 部署管線、設計系統(自文管庫複製)+ 首批純邏輯(音檔類型偵測、錄音格式探測)' },
  { phase: 'V1 ✅', title: '瀏覽器錄音機', desc: 'MediaRecorder 錄音/暫停/續錄、播放、下載(格式自動探測);錄音記錄僅 metadata 落地' },
  { phase: 'V2', title: '講稿與 AI(候選)', desc: '講稿編輯(錄音前/後);Gemini BYOK 音訊輸入:逐字稿、摘要、講稿生成;TTS 配音見 docs/TTS-PLAN.md——待拍板' },
  { phase: 'V3', title: '音轉影片分發', desc: '波形+封面以 canvas 合成影片檔,交媒管庫發佈(家族 family:* 契約)——podcast RSS 託管屬遠期' },
];

const FAMILY: Array<{ name: string; desc: string; url: string }> = [
  { name: 'TEXT-Message 文管庫', desc: '文字工作流:郵件 → 草稿 → AI 改寫 → 發文', url: 'https://galen-chu.github.io/TEXT-Message/' },
  { name: 'MEDIA-Message 媒管庫', desc: '媒體發佈:圖片/影片直傳,平台原生排程', url: 'https://galen-chu.github.io/MEDIA-Message/' },
];

interface DashboardProps {
  onGoRecord: () => void;
}

export default function Dashboard({ onGoRecord }: DashboardProps) {
  return (
    <div>
      <div className="t-page-title">
        {VOICES_COPY.brand}
      </div>
      <div className="t-page-desc" style={{ marginBottom: 20, marginTop: 4 }}>
        {VOICES_COPY.tagline}
      </div>

      <div className="card" style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span className="pill pill-brand">{VOICES_COPY.statusBadge}</span>
          <span className="t-sec-title">
            {VOICES_COPY.statusTitle}
          </span>
        </div>
        <div className="t-sub" style={{ color: 'var(--text-sub)', marginBottom: 14 }}>
          {VOICES_COPY.statusDesc}
        </div>
        <button type="button" className="btn btn-primary" onClick={onGoRecord}>
          🎙️ {VOICES_COPY.ctaBtn}
        </button>
      </div>

      <div className="card" style={{ padding: 18, marginBottom: 16 }}>
        <div className="t-sec-title" style={{ marginBottom: 8 }}>
          {VOICES_COPY.positioningTitle}
        </div>
        <div className="t-sub" style={{ color: 'var(--text-sub)' }}>
          {VOICES_COPY.positioningDesc}
        </div>
        <div
          className="t-sub"
          style={{
            marginTop: 12,
            padding: '10px 12px',
            borderRadius: 10,
            background: 'var(--surface-soft)',
          }}
        >
          🔒 {VOICES_COPY.redlineTitle}:{VOICES_COPY.redlineDesc}
        </div>
      </div>

      <div className="card" style={{ padding: 18, marginBottom: 16 }}>
        <div className="t-sec-title" style={{ marginBottom: 12 }}>
          {VOICES_COPY.roadmapTitle}
        </div>
        {ROADMAP.map((r) => (
          <div key={r.phase} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <span
              className="t-meta"
              style={{
                color: 'var(--brand)',
                fontWeight: 'var(--weight-bold)',
                background: 'var(--pill-brand-bg)',
                borderRadius: 8,
                padding: '4px 9px',
                height: 'fit-content',
                whiteSpace: 'nowrap',
              }}
            >
              {r.phase}
            </span>
            <div>
              <div className="t-item-title">{r.title}</div>
              <div className="t-sub" style={{ marginTop: 2 }}>
                {r.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div className="t-sec-title" style={{ marginBottom: 8 }}>
          {VOICES_COPY.familyTitle}
        </div>
        <div className="t-meta" style={{ marginBottom: 10 }}>{VOICES_COPY.familyDesc}</div>
        {FAMILY.map((f) => (
          <a
            key={f.name}
            href={f.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '10px 12px',
              borderRadius: 10,
              marginBottom: 8,
              border: '1px solid var(--border-2)',
              textDecoration: 'none',
            }}
          >
            <div className="t-item-title" style={{ color: 'var(--brand)' }}>{f.name}</div>
            <div className="t-sub">{f.desc}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
