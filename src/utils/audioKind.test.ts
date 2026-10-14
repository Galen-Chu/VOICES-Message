import { describe, expect, it } from 'vitest';
import { AUDIO_KIND_EXT, audioKindFromFilename, audioKindFromMime, detectAudioKind } from './audioKind';

describe('audioKindFromMime(僅 audio/*)', () => {
  it('MIME 前綴對應:webm/mp4/mpeg/wav/ogg;帶 codecs 也判得', () => {
    expect(audioKindFromMime('audio/webm')).toBe('webm');
    expect(audioKindFromMime('audio/webm;codecs=opus')).toBe('webm');
    expect(audioKindFromMime('audio/mp4;codecs=mp4a.40.2')).toBe('mp4');
    expect(audioKindFromMime('audio/mpeg')).toBe('mpeg');
    expect(audioKindFromMime('audio/wav')).toBe('wav');
    expect(audioKindFromMime('audio/x-wav')).toBe('wav');
    expect(audioKindFromMime('audio/ogg;codecs=opus')).toBe('ogg');
    expect(audioKindFromMime('audio/opus')).toBe('ogg');
  });

  it('非 audio/* 或未知 → null(交由呼叫端 fallback)', () => {
    expect(audioKindFromMime('video/webm')).toBeNull();
    expect(audioKindFromMime('application/octet-stream')).toBeNull();
    expect(audioKindFromMime('')).toBeNull();
    expect(audioKindFromMime('audio/flac')).toBeNull();
  });
});

describe('audioKindFromFilename(副檔名 fallback,大小寫不拘)', () => {
  it('常見副檔名對應;m4a 視為 mp4 家族', () => {
    expect(audioKindFromFilename('voice-01.webm')).toBe('webm');
    expect(audioKindFromFilename('voice.M4A')).toBe('mp4');
    expect(audioKindFromFilename('podcast.mp3')).toBe('mpeg');
    expect(audioKindFromFilename('interview.wav')).toBe('wav');
    expect(audioKindFromFilename('note.opus')).toBe('ogg');
  });

  it('無副檔名/未知副檔名 → unknown', () => {
    expect(audioKindFromFilename('recording')).toBe('unknown');
    expect(audioKindFromFilename('a.flac')).toBe('unknown');
  });
});

describe('detectAudioKind(MIME 優先 → 副檔名 fallback)', () => {
  it('MIME 可判則不看檔名;MIME 缺漏/非音檔時以副檔名救回', () => {
    expect(detectAudioKind('audio/webm;codecs=opus', 'x.dat')).toBe('webm');
    expect(detectAudioKind('application/octet-stream', 'voice.webm')).toBe('webm');
    expect(detectAudioKind('', 'voice.mp3')).toBe('mpeg');
    expect(detectAudioKind('video/mp4', 'a.m4a')).toBe('mp4');
    expect(detectAudioKind('', 'noext')).toBe('unknown');
  });
});

describe('AUDIO_KIND_EXT(建議副檔名)', () => {
  it('與偵測結果對應:mp4 家族下載用 .m4a', () => {
    expect(AUDIO_KIND_EXT[detectAudioKind('audio/mp4', 'x')]).toBe('.m4a');
    expect(AUDIO_KIND_EXT.unknown).toBe('');
  });
});
