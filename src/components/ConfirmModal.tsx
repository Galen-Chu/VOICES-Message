/**
 * 確認 Modal(V1;鏡像家族慣例:不可再生內容的刪除須確認——錄音 metadata 刪了就沒了,
 * 且記憶體音檔一併消失)。無障礙:role=dialog + aria-modal、Esc=取消、開啟時焦點落確認鈕。
 * (家族完整版 Modal 另有 focus trap;V1 對話框只有兩顆按鈕,初始焦點+Esc 已足。)
 */
import { useEffect, useRef } from 'react';

interface ConfirmModalProps {
  title: string;
  desc: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title,
  desc,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={{ padding: 18, maxWidth: 380 }}
      >
        <div className="t-card-title" style={{ marginBottom: 8 }}>{title}</div>
        <div className="t-sub" style={{ color: 'var(--text-sub)', marginBottom: 16 }}>{desc}</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="btn btn-primary" ref={confirmRef} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
