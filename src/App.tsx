import { VOICES_COPY } from './constants';

const ROADMAP: Array<{ phase: string; title: string; desc: string }> = [
  { phase: 'V0 ✅', title: '骨架與設計文件', desc: 'repo、V-PLAN、CI/Pages 部署管線、設計系統(自文管庫複製)+ 首批純邏輯(音檔類型偵測、錄音格式探測)' },
  { phase: 'V1', title: '瀏覽器錄音機', desc: 'MediaRecorder 錄音/暫停/播放/下載;錄音列表(僅 metadata 落地);格式探測適配 Chrome/Firefox/Safari' },
  { phase: 'V2', title: '講稿與 AI(候選)', desc: '講稿編輯(錄音前/後);Gemini BYOK 音訊輸入:逐字稿、摘要、講稿生成(瀏覽器直呼,零後端)——待拍板' },
  { phase: 'V3', title: '音轉影片分發', desc: '波形+封面以 canvas 合成影片檔,交媒管庫發佈(家族 family:* 契約)——podcast RSS 託管屬遠期' },
];

const FAMILY: Array<{ name: string; desc: string; url: string }> = [
  { name: 'TEXT-Message 文管庫', desc: '文字工作流:郵件 → 草稿 → AI 改寫 → 發文', url: 'https://galen-chu.github.io/TEXT-Message/' },
  { name: 'MEDIA-Message 媒管庫', desc: '媒體發佈:圖片/影片直傳,平台原生排程', url: 'https://galen-chu.github.io/MEDIA-Message/' },
];

export default function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ padding: '36px 24px 24px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
          <span
            style={{
              width: 46,
              height: 46,
              borderRadius: 13,
              background: 'var(--brand-fill)',
              color: '#fff',
              fontSize: 24,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            聲
          </span>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)' }}>{VOICES_COPY.brand}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-weak)' }}>VOICES-Message</div>
          </div>
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--text-sub)', marginBottom: 24 }}>{VOICES_COPY.tagline}</div>

        <div className="card" style={{ padding: 18, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span className="pill pill-purple">{VOICES_COPY.statusBadge}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>
              {VOICES_COPY.statusTitle}
            </span>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-sub)', lineHeight: 1.7 }}>{VOICES_COPY.statusDesc}</div>
        </div>

        <div className="card" style={{ padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
            {VOICES_COPY.positioningTitle}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-sub)', lineHeight: 1.7 }}>
            {VOICES_COPY.positioningDesc}
          </div>
          <div
            style={{
              marginTop: 12,
              padding: '10px 12px',
              borderRadius: 10,
              background: 'var(--surface-soft)',
              fontSize: 12,
              color: 'var(--text-weak)',
              lineHeight: 1.7,
            }}
          >
            🔒 {VOICES_COPY.redlineTitle}:{VOICES_COPY.redlineDesc}
          </div>
        </div>

        <div className="card" style={{ padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
            {VOICES_COPY.roadmapTitle}
          </div>
          {ROADMAP.map((r) => (
            <div key={r.phase} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--brand)',
                  background: 'var(--pill-purple-bg)',
                  borderRadius: 8,
                  padding: '4px 9px',
                  height: 'fit-content',
                  whiteSpace: 'nowrap',
                }}
              >
                {r.phase}
              </span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-main)' }}>{r.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-weak)', lineHeight: 1.6, marginTop: 2 }}>
                  {r.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
            {VOICES_COPY.familyTitle}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 10 }}>{VOICES_COPY.familyDesc}</div>
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
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--brand)' }}>{f.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-weak)' }}>{f.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
