import { describe, expect, it } from 'vitest';
import { selectSendProvider } from '../src/utils/send-provider.js';

describe('per-mailbox sending provider', () => {
  it('uses Resend by default when both services are configured', () => {
    expect(selectSendProvider('auto', 'test-key', {})).toBe('resend');
  });
  it('lets two mailboxes in the same domain choose different services', () => {
    expect(selectSendProvider('resend', 'test-key', {})).toBe('resend');
    expect(selectSendProvider('cloudflare', 'test-key', {})).toBe('cloudflare');
  });
  it('never falls back when an explicitly chosen service is unavailable', () => {
    expect(() => selectSendProvider('resend', null, {})).toThrow('resendNotConfigured');
    expect(() => selectSendProvider('cloudflare', 'test-key', null)).toThrow('cloudflareNotConfigured');
  });
  it('uses Cloudflare only when auto has no Resend configuration', () => {
    expect(selectSendProvider('auto', null, {})).toBe('cloudflare');
    expect(() => selectSendProvider('auto', null, null)).toThrow('noSendProvider');
  });
  it('rejects unknown provider values', () => {
    expect(() => selectSendProvider('unknown', 'test-key', {})).toThrow('invalidSendProvider');
  });
});
