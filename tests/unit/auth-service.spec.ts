import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const { LocalAuthProvider } = require('../../apps/desktop/electron/auth/auth-provider.cjs');

describe('LocalAuthProvider', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cd-auth-test-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (_e) {}
  });

  it('creates an account with strong password hashing (scrypt)', async () => {
    const provider = new LocalAuthProvider(tmpDir);

    const res = await provider.signUp({
      email: 'operator@northlight.studio',
      password: 'MySecurePassword2026!',
      confirmPassword: 'MySecurePassword2026!',
      name: 'Test Operator',
      workspaceName: 'Studio Test',
    });

    expect(res.success).toBe(true);
    expect(res.session).toBeDefined();
    expect(res.session.user.email).toBe('operator@northlight.studio');
    expect(res.session.user.name).toBe('Test Operator');

    // Inspect stored JSON on disk: ensure plaintext password NEVER appears
    const rawFile = fs.readFileSync(path.join(tmpDir, 'auth-store.json'), 'utf8');
    expect(rawFile).not.toContain('MySecurePassword2026!');
    
    // Salt and scrypt hash are present
    const parsed = JSON.parse(rawFile);
    const user = parsed.users.find((u: any) => u.email === 'operator@northlight.studio');
    expect(user).toBeDefined();
    expect(user.salt).toBeDefined();
    expect(user.passwordHash).toBeDefined();
    expect(user.passwordHash.length).toBe(128); // 64 bytes in hex
  });

  it('rejects duplicate email registrations', async () => {
    const provider = new LocalAuthProvider(tmpDir);

    const first = await provider.signUp({
      email: 'alex@northlight.studio',
      password: 'StrongPassword123!',
      confirmPassword: 'StrongPassword123!',
    });
    expect(first.success).toBe(true);

    const second = await provider.signUp({
      email: 'ALEX@northlight.studio', // case insensitive normalization
      password: 'DifferentPassword456!',
      confirmPassword: 'DifferentPassword456!',
    });
    expect(second.success).toBe(false);
    expect(second.error).toContain('Account already exists');
  });

  it('rejects passwords that do not match confirmation', async () => {
    const provider = new LocalAuthProvider(tmpDir);

    const res = await provider.signUp({
      email: 'mismatch@test.com',
      password: 'Password123!',
      confirmPassword: 'PasswordXYZ!',
    });
    expect(res.success).toBe(false);
    expect(res.error).toContain('Passwords do not match');
  });

  it('validates correct vs incorrect credentials upon sign in', async () => {
    const provider = new LocalAuthProvider(tmpDir);

    await provider.signUp({
      email: 'sarah@design.io',
      password: 'CorrectPassword1!',
      confirmPassword: 'CorrectPassword1!',
    });

    // Wrong password
    const wrong = await provider.signIn({
      email: 'sarah@design.io',
      password: 'WrongPassword999!',
    });
    expect(wrong.success).toBe(false);
    expect(wrong.error).toContain('Invalid credentials');

    // Non-existent email
    const nonExistent = await provider.signIn({
      email: 'nobody@nowhere.com',
      password: 'CorrectPassword1!',
    });
    expect(nonExistent.success).toBe(false);
    expect(nonExistent.error).toContain('Invalid credentials');

    // Correct password
    const correct = await provider.signIn({
      email: 'sarah@design.io',
      password: 'CorrectPassword1!',
    });
    expect(correct.success).toBe(true);
    expect(correct.session).toBeDefined();
    expect(correct.session.user.email).toBe('sarah@design.io');
  });

  it('restores authenticated session across application restarts', async () => {
    const provider1 = new LocalAuthProvider(tmpDir);

    await provider1.signUp({
      email: 'persisted@northlight.studio',
      password: 'PersistentPass2026!',
      confirmPassword: 'PersistentPass2026!',
    });

    // Fresh provider instance simulating next application launch
    const provider2 = new LocalAuthProvider(tmpDir);
    const active = await provider2.getSession();

    expect(active).not.toBeNull();
    expect(active?.user.email).toBe('persisted@northlight.studio');
    expect(active?.token).toBeDefined();
  });

  it('invalidates session on sign out while preserving user account and local data', async () => {
    const provider = new LocalAuthProvider(tmpDir);

    await provider.signUp({
      email: 'signedout@northlight.studio',
      password: 'SignOutTestPass1!',
      confirmPassword: 'SignOutTestPass1!',
    });

    expect(await provider.getSession()).not.toBeNull();

    // Sign out
    const out = await provider.signOut();
    expect(out.success).toBe(true);

    // Session is now cleared
    expect(await provider.getSession()).toBeNull();

    // Account record is preserved on disk
    const store = JSON.parse(fs.readFileSync(path.join(tmpDir, 'auth-store.json'), 'utf8'));
    const user = store.users.find((u: any) => u.email === 'signedout@northlight.studio');
    expect(user).toBeDefined();
  });
});
