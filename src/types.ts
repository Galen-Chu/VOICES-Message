/** 版面頁籤(V1 三頁籤;V2 講稿/V3 音轉影片再擴充)。 */
export type TabKey = 'dashboard' | 'record' | 'records';

/** 錄音啟動失敗碼(誠實降級:每碼對應一條可行動文案,見 RECORDER_ERROR_COPY)。 */
export type RecorderErrorCode = 'not-supported' | 'denied' | 'no-device' | 'unknown';
