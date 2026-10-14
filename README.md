# VOICES-Message(聲管庫)

**聲音為主、文字是講稿**——錄音、講稿到分發的聲音內容工作流。在瀏覽器錄製語音、整理講稿,分發以下載音檔或「音轉影片」交由家族產品發佈(音檔絕不落地、絕不經過後端)。

TEXT-Message(文管庫)家族產品:[文管庫](https://github.com/Galen-Chu/TEXT-Message)負責文字工作流,[媒管庫](https://github.com/Galen-Chu/MEDIA-Message)負責媒體發佈,本產品負責聲音內容。

**狀態:V0 骨架**——repo、設計規劃與可建置可測試的骨架已建立(2026-10-14);V1 瀏覽器錄音機為下一期。產品規劃、平台現實查證與分期見 [`docs/V-PLAN.md`](docs/V-PLAN.md)。

## 發展路線

| 期 | 內容 |
| --- | --- |
| V0 ✅ | 骨架與設計文件、CI/Pages 部署管線、首批純邏輯(音檔類型偵測、錄音格式探測) |
| V1 | 瀏覽器錄音機:MediaRecorder 錄音/播放/下載;錄音記錄僅 metadata 落地 |
| V2 | 講稿與 AI(候選):Gemini BYOK 逐字稿/摘要/講稿生成(瀏覽器直呼,零後端) |
| V3 | 音轉影片分發:canvas 波形+封面合成影片,交媒管庫發佈 |
| 遠期 | Podcast RSS 託管(觸發後端決策) |

## 開發

```bash
npm install
npm run dev      # 開發伺服器
npm run build    # 型別檢查 + 產出 dist/
npm test         # 單元測試(vitest)
npm run test:e2e # E2E smoke(Playwright,serve dist;需先 npm run build)
```

## 部署(GitHub Pages 自動部署)

push 到 `main` 即觸發 `.github/workflows/deploy.yml`:單元測試 → WCAG AA 對比度稽核 → 建置 → E2E smoke(部署閘門)→ 發佈到 GitHub Pages。PR 另有 CI 檢查。

> 隱私說明:本專案**沒有後端**。音檔僅存在瀏覽器記憶體,匯出由瀏覽器直接產生下載;錄音記錄僅 metadata(檔名/時長/說明)存於各自瀏覽器。

## 文件導覽

- [`docs/V-PLAN.md`](docs/V-PLAN.md) — 產品規劃:平台現實查證、決策記錄 D1–D7、分期
- [`CLAUDE.md`](CLAUDE.md) — 工程慣例:架構、紅線、CI/CD
- [`LICENSE`](LICENSE) — MIT License

## 授權

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
