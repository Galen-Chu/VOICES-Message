/**
 * 側欄(V1 殼層,結構複製媒管庫 Sidebar.tsx):三頁籤——聲管 Dashboard/錄音機 Record/
 * 錄音記錄 Records。窄螢幕(≤720px)收合慣例由既有 CSS class 負責(.nav-label 收文字)。
 * V1 刻意不加家族切換連結(兩庫的 U2 側欄切換):V2/V3 handoff 上線時比照兩庫同位置補上。
 */
import { APP_TITLE, SIDEBAR_IDENTITY_SUB, TAB_LABELS } from '../constants';
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
        <div className="sidebar-brand-text" style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-main)' }}>
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
              className="nav-btn"
              onClick={() => onTabChange(item.key)}
              aria-current={active ? 'page' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                fontSize: 13.5,
                textAlign: 'left',
                fontWeight: active ? 700 : 500,
                color: active ? 'var(--brand)' : 'var(--text-sub)',
                background: active ? 'var(--pill-brand-bg)' : 'transparent',
              }}
            >
              <span style={{ fontSize: 18 }} aria-hidden="true">
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
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>{APP_TITLE}</div>
          <div style={{ fontSize: 11, color: 'var(--text-weak)' }}>{SIDEBAR_IDENTITY_SUB}</div>
        </div>
      </div>
    </div>
  );
}
