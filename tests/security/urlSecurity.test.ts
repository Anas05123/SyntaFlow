import { describe, it, expect } from 'vitest';
import {
  sanitizeReturnUrl,
  isValidLoopbackRedirect,
  isSafeCustomProtocol,
} from '../../apps/web/src/utils/urlSecurity';

describe('sanitizeReturnUrl', () => {
  it('accepts safe internal paths', () => {
    expect(sanitizeReturnUrl('/account')).toBe('/account');
    expect(sanitizeReturnUrl('/account/downloads')).toBe('/account/downloads');
    expect(sanitizeReturnUrl('/download?utm=test')).toBe('/download?utm=test');
    expect(sanitizeReturnUrl('/auth/desktop?state=123')).toBe('/auth/desktop?state=123');
  });

  it('rejects external protocol attacks (open redirect)', () => {
    expect(sanitizeReturnUrl('https://evil.example.com')).toBe('/account');
    expect(sanitizeReturnUrl('http://evil.example.com')).toBe('/account');
    expect(sanitizeReturnUrl('//evil.example.com')).toBe('/account');
    expect(sanitizeReturnUrl('//evil.example.com/account')).toBe('/account');
  });

  it('rejects javascript and data URIs', () => {
    expect(sanitizeReturnUrl('javascript:alert(1)')).toBe('/account');
    expect(sanitizeReturnUrl('data:text/html,<script>alert(1)</script>')).toBe('/account');
  });

  it('rejects backslash evasion tricks', () => {
    expect(sanitizeReturnUrl('/\\evil.example.com')).toBe('/account');
  });

  it('falls back to custom fallback when specified', () => {
    expect(sanitizeReturnUrl('invalid-url', '/home')).toBe('/home');
    expect(sanitizeReturnUrl(null, '/home')).toBe('/home');
  });
});

describe('isValidLoopbackRedirect', () => {
  it('accepts valid 127.0.0.1 loopback URLs with unprivileged ports', () => {
    expect(isValidLoopbackRedirect('http://127.0.0.1:5173/callback')).toBe(true);
    expect(isValidLoopbackRedirect('http://127.0.0.1:49152/callback')).toBe(true);
  });

  it('rejects remote hosts and non-http protocols', () => {
    expect(isValidLoopbackRedirect('https://127.0.0.1:5173/callback')).toBe(false);
    expect(isValidLoopbackRedirect('http://localhost:5173/callback')).toBe(false);
    expect(isValidLoopbackRedirect('http://192.168.1.1:5173/callback')).toBe(false);
    expect(isValidLoopbackRedirect('http://attacker.com:5173/callback')).toBe(false);
  });

  it('rejects privileged ports below 1024', () => {
    expect(isValidLoopbackRedirect('http://127.0.0.1:80/callback')).toBe(false);
    expect(isValidLoopbackRedirect('http://127.0.0.1:443/callback')).toBe(false);
  });
});

describe('isSafeCustomProtocol', () => {
  it('accepts syntaflow custom protocol callbacks', () => {
    expect(isSafeCustomProtocol('syntaflow://auth/callback')).toBe(true);
    expect(isSafeCustomProtocol('syntaflow://auth/callback?code=xyz')).toBe(true);
  });

  it('rejects unsafe protocols or invalid paths', () => {
    expect(isSafeCustomProtocol('http://auth/callback')).toBe(false);
    expect(isSafeCustomProtocol('coredesk://auth/callback')).toBe(false);
  });
});
