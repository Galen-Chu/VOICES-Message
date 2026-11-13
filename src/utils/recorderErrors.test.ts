import { describe, expect, it } from 'vitest';
import { micErrorToCode } from './recorderErrors';

const named = (name: string) => {
  const e = new Error('x');
  e.name = name;
  return e;
};

describe('micErrorToCode', () => {
  it('權限拒絕系 → denied', () => {
    expect(micErrorToCode(named('NotAllowedError'))).toBe('denied');
    expect(micErrorToCode(named('SecurityError'))).toBe('denied');
    expect(micErrorToCode(named('PermissionDeniedError'))).toBe('denied');
  });

  it('裝置不可用系(含被占用)→ no-device', () => {
    expect(micErrorToCode(named('NotFoundError'))).toBe('no-device');
    expect(micErrorToCode(named('NotReadableError'))).toBe('no-device');
    expect(micErrorToCode(named('OverconstrainedError'))).toBe('no-device');
  });

  it('無法辨識誠實落 unknown', () => {
    expect(micErrorToCode(named('AbortError'))).toBe('unknown');
    expect(micErrorToCode(new Error('x'))).toBe('unknown');
  });

  it('非例外輸入不炸', () => {
    expect(micErrorToCode(null)).toBe('unknown');
    expect(micErrorToCode('NotAllowedError')).toBe('unknown');
    expect(micErrorToCode({ name: 123 })).toBe('unknown');
  });
});
