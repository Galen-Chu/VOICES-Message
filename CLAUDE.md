# CLAUDE.md

VOICES-Message(聲管庫;repo Galen-Chu/VOICES-Message)— **聲音為主、文字是講稿**的聲音內容工作流:瀏覽器錄音、講稿整理、分發(下載/音轉影片交媒管庫)。與 TEXT-Message(文管庫)、MEDIA-Message(媒管庫)為家族產品,技術骨架與慣例整套沿用文管庫(見下);**目前狀態:V1 瀏覽器錄音機(2026-11-13)**,產品決策與分期見 `docs/V-PLAN.md`(D1–D7 為暫行決議,動工前可推翻)。

## 常用指令

```bash
npm run dev        # 開發伺服器
npm run build      # tsc -b + vite build
npm test           # 單元測試(vitest)
npm run test:e2e   # Playwright E2E(serve dist;跑之前先 npm run build)
npm run test:contrast    # WCAG AA 對比度稽核(scripts/contrast-audit.mjs)
npm run test:typography  # 字體規格稽核(scripts/typography-audit.mjs;2026-11-20 自文管庫推廣,接入 ci.yml/deploy.yml)
```

## 架構(V1 錄音機)

- 前端:React 19 + TypeScript 7(strict)+ Vite 8(文管庫 2026-10-06 升級後同版工具鏈,家族最現代版)
- `src/App.tsx` — 殼層:三頁籤(聲管 Dashboard / 編發器 Voices / 錄音記錄 Records;hash 深連結 `#record`/`#records`)。**「編發器 Voices」= 2026-11-20 更名(原「錄音機 Record」,V-PLAN D8:三庫編輯頁家族統一「編發器+英文詞」——文管庫 Draft/媒管庫 Media/聲管庫 Voices)**;僅顯示層更名,Tab key `record` 不動(家族「內部識別字不隨顯示名變動」慣例)+ 狀態分工(records=metadata 落地、sessions=本工作階段音檔 blob+object URL 僅記憶體、刪除時 revoke)
- `src/hooks/useRecorder.ts` — 錄音狀態機(**全專案唯一碰 MediaRecorder/getUserMedia 的層**):idle→starting→recording⇄paused→idle、error(含錯誤碼);計時走 recorderClock 區段(暫停不計);stop() 以 Promise 回傳 `{blob, mime, durationSec}`;卸載清理停用麥克風軌
- `src/services/recordings.ts` — 錄音記錄 metadata 存取(storage 可注入、防禦式解析單筆壞不連坐、永不拋;鏡像媒管庫 library.ts 模式)
- `src/utils/` 純邏輯:`format`(時長/大小/M-D HH:mm)、`recorderClock`(區段計時)、`downloadName`(Windows 非法字元防護)、`recorderErrors`(麥克風例外→可行動錯誤碼)+ V0 的 `audioKind`/`recorderMime`
- `src/components/` — Sidebar(三頁籤,鏡像媒管庫;家族切換連結 2026-11-20 三方互連上線——原規劃留待 V2/V3 handoff,維護者拍板提前)/ Dashboard(V0 落地頁+錄音入口)/ RecordPage / RecordingsPage(inline 編輯標題說明、刪除確認 Modal)/ ConfirmModal(Esc+初始焦點)
- `src/constants.ts` — UI 字串集中(TAB_LABELS/REC_COPY/RECORDER_ERROR_COPY/RECORDS_COPY/NOTICE_COPY)
- `src/index.css` — 設計系統自文管庫整套複製(深色模式、WCAG AA 已驗證 token;調整 palette 時重跑 `npm run test:contrast`);**2026-11-20 字體規格系統自文管庫推廣**——`:root` 字級/字重/行高 token+`.t-*` 角色類別(級數表見文管庫 `docs/UIUX.md` §六),元件不得寫 inline 字級/字重/行高字面值(`npm run test:typography` 守門)
- `vite.config.ts` 的 `base: '/VOICES-Message/'` 為 Pages 子路徑所需,勿移除
- 後端:**無**(V0–V3 設計零後端;podcast 託管屬遠期,屆時才觸發後端決策)

## 紅線(修改時勿破壞)

- **音檔絕不落地、絕不經後端**——僅存瀏覽器記憶體,localStorage 只存 metadata(檔名/類型/時長/大小/說明)與使用者內容(講稿等),key `voices-message:v1`
- AI key(BYOK)僅存使用者瀏覽器;沿用家族 IA-D8:可唯讀文管庫 `text-message:gemini-key`(永不寫入/清除對方鍵)
- **跨產品(同源 galen-chu.github.io)**:跨庫一律走版本化 `family:*` 契約鍵,不互讀對方內部鍵(`text-message:v2` / `media-message:v1`);契約見文管庫 `docs/IA-PLAN.md` §3.2,V2/V3 實作時於 V-PLAN §5 補充
- 未來任何 VITE_ 環境注入一律 env+shell `if`(**secrets 不可用於 step 的 `if:`**,家族 CI 教訓)

## CI/CD

- PR:`.github/workflows/ci.yml`(vitest → 對比度 → build → Playwright)
- main push:`deploy.yml`(test → 對比度 → build → E2E → Pages;**E2E 是部署閘門**)
- 對比度稽核=`npm run test:contrast`(解析 `src/index.css` token,未達 WCAG AA 4.5:1 即 exit 1)

## 慣例(沿用家族紀律)

- 語言:zh-Hant;UI 字串集中放 `constants.ts`,不散落元件
- **串接紀律**:動手寫任何平台 API 串接前,先查**當下**官方文件(端點、HTTP method、參數名、回應值型別逐一對照),文件 URL 註解在 config 常數旁;單元測試斷言**完整請求形狀**;Meta 系 id 可能超 JS 安全整數——從原始回應文字抽取
- 新增純邏輯一律配 vitest 單元測試;hooks 測試以 `// @vitest-environment jsdom` 單檔切環境;E2E 維持 smoke 等級
- vitest pool 固定 `threads`(家族實證:forks 在 Windows 隨機丟檔)
- 版本與依賴異動需同步 `package-lock.json`(部署用 `npm ci`)
- 與家族共用元件採**複製**,不 monorepo;三產品路線圖互不綁架
- 文件慣例:root 僅 `README.md` 與 `CLAUDE.md`,其餘全在 `docs/`、全大寫;計畫檔 `-PLAN` 後綴(`docs/V-PLAN.md` 為常駐路線圖)

## 開發待辦

- ~~V1 瀏覽器錄音機~~(**2026-11-13 完成**:錄/暫停/續錄/停止、播放、下載(副檔名依格式)、錄音記錄(metadata 落地 `voices-message:v1`)、標題/說明 inline 編輯、刪除確認 Modal、麥克風權限與不支援環境誠實降級;45 測/對比度/E2E 4 全綠——E2E 含 headless 無麥克風權限的降級路徑驗證)
- V2 講稿與 AI(候選,待維護者拍板):Gemini BYOK 音訊輸入(逐字稿/摘要/講稿生成);TTS 配音架構另見 `docs/TTS-PLAN.md`(TD-3 本機引擎拍板前不安裝)
- V3 音轉影片:canvas 波形+封面合成 → family handoff 交媒管庫
- 遠期:Podcast RSS(觸發後端決策,與媒管庫 M3 圖床共用一次大定案)
