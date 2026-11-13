import { describe, expect, it } from 'vitest';
import { buildDownloadFilename, sanitizeRecordingTitle } from './downloadName';

describe('sanitizeRecordingTitle', () => {
  it('Windows 非法字元以空格取代、連續空白收斂', () => {
    expect(sanitizeRecordingTitle('a<b>:c/d\\e|f?g"h*i')).toBe('a b c d e f g h i');
  });

  it('控制字元移除', () => {
    expect(sanitizeRecordingTitle('x\u0000y\u001fz')).toBe('x y z');
  });

  it('全空防禦為「錄音」', () => {
    expect(sanitizeRecordingTitle('')).toBe('錄音');
    expect(sanitizeRecordingTitle('   ')).toBe('錄音');
    expect(sanitizeRecordingTitle('///')).toBe('錄音');
  });

  it('正常標題原樣保留(含中文與空格)', () => {
    expect(sanitizeRecordingTitle('週三 晨間語音筆記')).toBe('週三 晨間語音筆記');
  });
});

describe('buildDownloadFilename', () => {
  it('主體+副檔名(含前導點)', () => {
    expect(buildDownloadFilename('測試 A', '.webm')).toBe('測試 A.webm');
  });

  it('副檔名缺前導點自動補', () => {
    expect(buildDownloadFilename('測試', 'm4a')).toBe('測試.m4a');
  });

  it('空副檔名僅主體;空標題防禦', () => {
    expect(buildDownloadFilename('測試', '')).toBe('測試');
    expect(buildDownloadFilename('', '.webm')).toBe('錄音.webm');
  });
});
