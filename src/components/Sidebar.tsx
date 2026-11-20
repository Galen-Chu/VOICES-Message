/**
 * 側欄(V1 殼層,結構複製媒管庫 Sidebar.tsx):三頁籤——聲管 Dashboard/編發器 Voices/
 * 錄音記錄 Records。窄螢幕(≤720px)收合慣例由既有 CSS class 負責(.nav-label 收文字)。
 * 家族常駐切換(2026-11-20 三方互連,比照兩庫 U2):兩條連結放識別塊外面、同位置同樣式;
 * 原規劃留待 V2/V3 handoff,提前上線=導覽不等契約(維護者 2026-11-20 拍板)。
 */
import { APP_TITLE, FAMILY_LINKS, SIDEBAR_IDENTITY_SUB, TAB_LABELS } from '../constants';
import type { TabKey } from '../types';
import type { ReactNode } from 'react';
import { BrandMark, IconDashboard, IconLedger, IconWave } from './BrandIcons';

const NAV_ITEMS: Array<{ key: TabKey; icon: ReactNode; label: string }> = [
  { key: 'dashboard', icon: <IconDashboard />, label: TAB_LABELS.dashboard },
  { key: 'record', icon: <IconWave />, label: TAB_LABELS.record },
  { key: 'records', icon: <IconLedger />, label: TAB_LABELS.records },
];

interface SidebarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="app-sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 24px 8px' }}>
        <BrandMark size={36} />
        <div className="sidebar-brand-text t-card-title">
          {APP_TITLE}
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }} aria-label="主導覽">
        {NAV_ITEMS.map((item) => {
          const active = item.key === activeTab;
          return (
            <button
              key={item.key}
              type="button"
              className="nav-btn t-body"
              onClick={() => onTabChange(item.key)}
              aria-current={active ? 'page' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                textAlign: 'left',
                fontWeight: active ? 'var(--weight-bold)' : 'var(--weight-medium)',
                color: active ? 'var(--brand)' : 'var(--text-sub)',
                background: active ? 'var(--pill-brand-bg)' : 'transparent',
              }}
            >
              <span className="t-emoji" aria-hidden="true">
                {item.icon}
              </span>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div
        className="sidebar-footer"
        style={{
          marginTop: 'auto',
          padding: '14px 12px',
          background: 'var(--surface-soft)',
          borderRadius: 12,
        }}
      >
        <BrandMark size={34} />
        <div>
          <div className="t-sec-title">{APP_TITLE}</div>
          <div className="t-meta">{SIDEBAR_IDENTITY_SUB}</div>
        </div>
      </div>

      {/*
        家族常駐切換(2026-11-20 三方互連,比照兩庫 U2 慣例):刻意放在識別塊外面——
        `.sidebar-footer` 在 ≤720px 整塊 display:none,放裡面窄螢幕就沒有入口可按。
        沿用 `.nav-label` 收合慣例:窄螢幕只留圖示(靠 title 提示)。
      */}
      {FAMILY_LINKS.map((f) => (
        <a
          key={f.url}
          className="nav-btn sidebar-family-link t-sub"
          href={f.url}
          target="_blank"
          rel="noopener noreferrer"
          title={f.title}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 10,
            fontWeight: 'var(--weight-semibold)',
            color: 'var(--brand)',
            textDecoration: 'none',
          }}
        >
          <span className="t-emoji" aria-hidden="true">
            {f.icon}
          </span>
          <span className="nav-label">{f.label}</span>
        </a>
      ))}
    </div>
  );
}
