# TTS 配音與字幕架構規劃(TTS-PLAN)

2026-11-13 立檔。起源=個人影片產出管線討論(同日定案,見媒管庫 `docs/VIDEO-PIPELINE-PLAN.md`):**TTS/AI 配音與字幕生成架構劃歸聲管庫產品線規劃**。本檔=V-PLAN V2「講稿與 AI」的功能分拆計畫檔(V-PLAN 慣例:某期決策膨脹才分拆);V2 主線(逐字稿/摘要/講稿生成)仍以 V-PLAN 為準,本檔負責新增的「講稿→配音」與「字幕」兩個方向。

## 1. 定位:兩個平面(與 VIDEO-PIPELINE 同構)

| 平面 | 場域 | 約束 |
| --- | --- | --- |
| **產品內**(VOICES-Message 網頁) | 講稿編輯、TTS 預聽、配音生成、下載、音轉影片 | 零後端、**音檔絕不落地絕不經後端**(V-PLAN D5)、AI key BYOK(IA-D8 家族金鑰慣例) |
| **個人本機管線**(audio-pipeline,機器級工具) | 講稿→TTS 配音檔→字幕對齊→交影片管線/剪輯軟體 | 個人工具不受產品紅線約束,但自律紀律:講稿與音檔不出機器(TTS 若走線上引擎則僅送講稿文字) |

分界原則:**有時間戳的字幕(SRT)與配音檔的批次產出屬本機管線;產品內做到「講稿→預聽/生成→下載」為止**。

## 2. TTS 引擎評估

### 產品內(瀏覽器)

- **Gemini TTS BYOK(主候選)**:Gemini 2.5 系原生語音生成(講稿+語氣 prompt→音檔);金鑰沿用家族慣例(唯讀文管庫 `text-message:gemini-key`);瀏覽器直呼、回應音檔僅存記憶體。**動工前依串接紀律查當下官方文件**(規格/計費/語音清單/請求上限)。
- **Web Speech API(speechSynthesis,輔助)**:瀏覽器內建、零依賴離線,適合「講稿預聽節奏」;**關鍵限制:只輸出到音效設備、不提供音檔**——不能產出配音檔,僅作預聽。zh-TW 語音品質依 OS/瀏覽器而異。
- **不採**:第三方雲 TTS(edge-tts 等)——金鑰體系不在家族慣例、且過第三方雲。

### 個人本機管線(待拍板,二擇一)

- **edge-tts**(Python 套件):免費、zh-TW 多聲、品質佳;代價=**過微軟雲**(僅講稿文字出機器)+ 非官方 API,穩定性有斷裂風險。
- **Piper**:純本機離線、模型自管、零外送;代價=聲音清單要試聽挑選、中文聲音品質待驗。

## 3. 字幕生成架構

- **本機**:與影片管線**共用同一套 faster-whisper 安裝**(2026-11-13 已於本機 Python 3.14 驗證:faster-whisper 1.2.1 + ctranslate2 4.9.0);word-level 時間戳→SRT。**不重複建**。
- **產品內**:V2 逐字稿(Gemini 音訊輸入)為文字無精確時間戳——產品內字幕形態=逐字稿文本;要 SRT 就走本機管線(誠實分工,不假裝瀏覽器能對齊時間戳)。
- 繁中坑沿用 VIDEO-PIPELINE D5:Whisper 系輸出偏簡體,initial_prompt 引導或後處理轉繁。

## 4. 決策記錄(TD-1 起,2026-11-13 暫行定案;動工前維護者可推翻,改動即更新本節)

- **TD-1 兩平面分工**:配音檔與有時間戳字幕的批次產出=個人本機管線;產品內到「講稿→預聽/生成→下載」為止。
- **TD-2 產品內 TTS**:Gemini TTS BYOK 為主候選(動工前查當下文件)、Web Speech 為預聽輔助;不採第三方雲 TTS。
- **TD-3 本機 TTS 引擎待拍板**(edge-tts vs Piper,見 §2);**拍板前不安裝、不測試**。
- **TD-4 字幕架構共用**:faster-whisper 一套安裝服務 video-pipeline 與 audio-pipeline 兩條管線。
- **TD-5 音檔邊界**:TTS 生成之音檔在產品內=僅記憶體(下載即離開頁面);講稿本身=使用者內容,可落地 `voices-message:v1`(與既有講稿同規)。
- **TD-6 UI 規格依循**:Uniconsign 設計系統(`D:\Uniconsign`——`tokens/` 規格、icon 先查 `icons/order.json` 不手繪)+ 架構類比 TEXT-Message(V-PLAN D7 既定:React 19/TS 7 strict/Vite 8、字串集中 constants.ts、對比度閘門、字體規格稽核)。

## 5. 分期

- **TP0(✅ 2026-11-13)**:本檔+audio-pipeline SKILL.md 骨架(個人 skills;原名 voice-pipeline,同日更名對齊聲管庫 audio 命名)。
- **TP1**:維護者拍板本機 TTS 引擎 → 安裝+跑通「講稿→配音檔→(faster-whisper 對齊)→SRT」閉環。
- **TP2**:配音音軌接入影片管線(混音/ducking)或交剪輯軟體工位。
- **TP3(產品側,V1 錄音機完成後)**:V2 擴充實作——講稿編輯接 Web Speech 預聽、Gemini TTS BYOK 生成配音(下載/音轉影片);family handoff 講稿送文管庫照舊。

## 6. 邊界備忘

- 配音音軌「混進影片」的剪輯屬影片管線/剪輯軟體工位(VIDEO-PIPELINE §3「混真人旁白」同規);本管線產出到音檔+字幕為止。
- 與 V3 音轉影片的關係:TP3 之後聲管庫可自產「配音+波形影片」交媒管庫,V3 形態更完整(講稿→配音→波形影片→發佈)。

## 附錄:audio-pipeline SKILL.md 全文快照(跨機重建)

維護者**跨多機使用**:skill 檔在個人層級 `~/.claude/skills/`(Windows=`C:\Users\<帳號>\.claude\skills\`),刻意不入 repo。**共用轉錄腳本 `transcribe.py` 的全文與完整重建步驟(含 Python/FFmpeg 安裝、模型下載)見媒管庫 `docs/VIDEO-PIPELINE-PLAN.md` §6——兩個 skill 目錄一起建**;本附錄僅補 audio-pipeline 這一份,同步紀律=**改 skill 必同步本附錄**。

````markdown
---
name: audio-pipeline
description: 音訊管線——講稿→TTS 配音→字幕對齊(SRT)的個人本機管線。要從文字講稿產生配音音檔與字幕檔、或對既有音檔做轉錄/字幕時使用。規劃依據:VOICES-Message docs/TTS-PLAN.md。
---

# audio-pipeline(講稿 → 配音 → 字幕)

個人本機工具(非 VOICES-Message 產品功能);架構決策見 `D:\VOICES-Message\docs\TTS-PLAN.md`。**兩個半邊**:字幕半邊可運轉(已驗證);TTS 半邊待維護者拍板引擎(TD-3,**拍板前不安裝不測試**)。

## 環境(已驗證,2026-11-13)

- Python 3.14 + faster-whisper 1.2.1(解碼不經 PyAV——見 transcribe.py 檔頭說明)
- 轉錄腳本(與 video-pipeline 共用):`C:\Users\a25002\.claude\skills\video-pipeline\scripts\transcribe.py`
- FFmpeg:`D:\tools\ffmpeg\root\bin\ffmpeg.exe`(未上 PATH,用絕對路徑)

## 工作流 A:既有音檔 → 字幕(可運轉)

```bash
python "C:/Users/a25002/.claude/skills/video-pipeline/scripts/transcribe.py" <音檔> --model small --lang zh --zh-tw
# 輸出 <檔名>.srt(字幕)+ <檔名>.json(word-level 時間戳,供剪輯對齊)
```

- 繁中一律加 `--zh-tw`(實測:輸出維持繁體;不加則偏簡體)
- 模型:small=繁中建議起點;tiny 只用於快速煙霧測試(實測技術名詞會錯字、zh 分段偏粗)

## 工作流 B:講稿 → TTS 配音(待拍板,勿執行)

引擎二擇一,**尚未安裝**——使用者拍板前本節僅為規格備忘:

- 選項一 edge-tts(雲端,過微軟;僅講稿文字出機器):`edge-tts --voice zh-TW-HsiaoChenTTS --file script.txt --write-media out.mp3` 再以 `edge-tts --sub-format srt --write-subtitles out.srt` 直接拿字幕(時間戳來源即 TTS,免轉錄)
- 選項二 Piper(純本機離線):`piper --model zh_TW-hsiaoyu-medium --output_file out.wav`;字幕需再跑工作流 A 對齊

拍板後:安裝、以 D:\tools\pipeline-test 產出實測、回填本節與 TTS-PLAN TP1。

## 交付與紀律

- 產出:音檔 + .srt/.json,交剪輯軟體或 video-pipeline 混音(ducking 見 video-pipeline SKILL)
- **講稿與音檔不出機器**;唯一例外=拍板採用雲端引擎時僅送講稿文字、且 UI/流程須明示
- 命名:產出檔沿用講稿檔名;放講稿同目錄或指定 --outdir
````
