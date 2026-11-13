/**
 * 聲管庫 UI 字串集中(V1 錄音機;家族慣例:文案不散落元件、測試可釘關鍵句)。
 */
import type { RecorderErrorCode, TabKey } from './types';
import type { AudioKind } from './utils/audioKind';

export const APP_TITLE = '聲管庫 Voices';
export const SIDEBAR_IDENTITY_SUB = 'VOICES-Message';

export const TAB_LABELS: Record<TabKey, string> = {
  dashboard: '聲管 Dashboard',
  record: '錄音機 Record',
  records: '錄音記錄 Records',
};

/** Dashboard(V0 落地頁延續;V1 起加錄音入口)。 */
export const VOICES_COPY = {
  brand: '聲管庫 Voices',
  tagline: '聲音為主、文字是講稿——錄音、講稿到分發的聲音內容工作流',
  statusBadge: 'V1 錄音機',
  statusTitle: '產品狀態',
  statusDesc:
    '瀏覽器錄音機已上線:錄音/暫停/續錄、播放、下載(格式依瀏覽器自動探測 webm/mp4);錄音記錄僅存 metadata。下一期:V2 講稿與 AI(待拍板)',
  positioningTitle: '產品定位',
  positioningDesc:
    '家族第三條產品線:文管庫負責文字工作流、媒管庫負責媒體發佈,本產品負責聲音內容——先做「短語音+講稿」(零後端、瀏覽器錄音),podcast 節目線為遠期(需音檔託管,屆時才觸發後端決策)',
  roadmapTitle: '發展路線',
  familyTitle: '家族產品',
  familyDesc: '同源部署、各自獨立repo,跨產品走 family:* 契約鍵(見 V-PLAN §5)',
  redlineTitle: '資料紅線',
  redlineDesc: '音檔僅存瀏覽器記憶體、絕不落地、絕不經後端——落地僅 metadata(檔名/時長/大小/說明)',
  ctaBtn: '前往錄音機',
};

/** 錄音機頁(V1)。 */
export const REC_COPY = {
  pageTitle: '錄音機 Record',
  pageDesc: '瀏覽器錄音:開始/暫停/續錄/停止,格式依瀏覽器自動探測(Chrome/Edge/Firefox=WebM、Safari=M4A)',
  startBtn: '開始錄音',
  startingBtn: '啟動麥克風…',
  pauseBtn: '暫停',
  resumeBtn: '續錄',
  stopBtn: '停止並保存',
  retryBtn: '重試',
  statusIdle: '待機',
  statusRecording: '● 收音中',
  statusPaused: '⏸ 已暫停(暫停時間不計入時長)',
  honestNote: '音檔只存在這個分頁的記憶體:重新整理或關閉分頁即消失——要保留請停止後到「錄音記錄」下載。',
  errorTitle: '無法開始錄音',
};

/** 錯誤碼 → 可行動文案(不可收斂成 generic;not-supported 另由能力檢查直出)。 */
export const RECORDER_ERROR_COPY: Record<RecorderErrorCode, string> = {
  'not-supported': '此瀏覽器不支援錄音(需要 MediaRecorder 與麥克風存取 API)。請改用最新版 Chrome、Edge 或 Safari。',
  denied: '麥克風權限被拒絕。請點網址列的權限圖示允許麥克風後重試。',
  'no-device': '找不到麥克風,或麥克風正被其他應用程式使用。請確認裝置狀態後重試。',
  unknown: '錄音啟動失敗,請再試一次。',
};

/** 錄音記錄頁(V1)。 */
export const RECORDS_COPY = {
  pageTitle: '錄音記錄 Records',
  pageDesc: '每段錄音的 metadata 記錄(標題/格式/時長/大小/說明),存於本機瀏覽器',
  honestTitle: '🔒 音檔紅線',
  honestDesc:
    '音檔僅存瀏覽器記憶體、絕不落地——這份清單只存 metadata。重新整理或關閉分頁後音檔即消失(記錄保留);要保留音檔請在離開前下載。',
  emptyTitle: '還沒有錄音記錄',
  emptyDesc: '到「錄音機」錄第一段聲音。',
  audioUnavailable: '音檔已不在此工作階段(重新整理/關閉分頁即消失)——此為紅線設計,非故障',
  download: '下載',
  deleteBtn: '刪除',
  notePlaceholder: '說明(選填)',
  confirmDeleteTitle: '刪除這筆錄音記錄?',
  confirmDeleteDesc: '刪除後 metadata 無法復原;若音檔仍在這個工作階段的記憶體,也會一併消失、無法再下載。',
  confirmCancel: '取消',
  confirmDelete: '刪除',
  kindLabel: {
    webm: 'WebM',
    mp4: 'M4A',
    mpeg: 'MP3',
    wav: 'WAV',
    ogg: 'OGG',
    unknown: '未知格式',
  } satisfies Record<AudioKind, string>,
};

/** 操作回饋(toast;role=status)。 */
export const NOTICE_COPY = {
  saved: '已存入錄音記錄——音檔只在本工作階段可播放與下載',
  saveFailed: '記錄寫入失敗(瀏覽器儲存空間可能已滿):本清單僅存在這個工作階段',
  deleted: '已刪除錄音記錄',
};
