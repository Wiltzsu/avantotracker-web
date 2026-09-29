import { describe, expect, it } from 'vitest';
import { isStrongPassword } from './passwordRules';

describe('isStrongPassword', () => {
  it('accepts passwords that match API rules', () => {
    expect(isStrongPassword('Password1')).toBe(true);
  });

  it('rejects weak passwords', () => {
    expect(isStrongPassword('password')).toBe(false);
    expect(isStrongPassword('PASSWORD1')).toBe(false);
    expect(isStrongPassword('Pass1')).toBe(false);
  });
});
