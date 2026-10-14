/** 聲管庫 UI 字串集中(V0 骨架;V1 起各功能文案依 family 慣例續加)。 */
export const VOICES_COPY = {
  brand: '聲管庫 Voices',
  tagline: '聲音為主、文字是講稿——錄音、講稿到分發的聲音內容工作流',
  statusBadge: 'V0 骨架',
  statusTitle: '產品狀態',
  statusDesc:
    'repo 與設計文件已建立(V-PLAN),骨架可建置、可測試、可部署;V1 瀏覽器錄音機為下一期',
  positioningTitle: '產品定位',
  positioningDesc:
    '家族第三條產品線:文管庫負責文字工作流、媒管庫負責媒體發佈,本產品負責聲音內容——先做「短語音+講稿」(零後端、瀏覽器錄音),podcast 節目線為遠期(需音檔託管,屆時才觸發後端決策)',
  roadmapTitle: '發展路線',
  familyTitle: '家族產品',
  familyDesc: '同源部署、各自獨立repo,跨產品走 family:* 契約鍵(見 V-PLAN §5)',
  redlineTitle: '資料紅線',
  redlineDesc: '音檔僅存瀏覽器記憶體、絕不落地、絕不經後端——落地僅 metadata(檔名/時長/大小/說明)',
};
