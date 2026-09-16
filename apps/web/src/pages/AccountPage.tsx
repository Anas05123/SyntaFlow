import React, { useState, useEffect, useCallback } from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../services/auth/AuthContext';
import type { DeviceSession } from '../types/auth';
import {
  listActiveSessions,
  revokeSession,
  revokeAllOtherSessions,
  updateProfileName,
  changePassword,
} from '../services/auth/appwriteClient';

export const AccountPage: React.FC = () => {
  const { user, plan, isAuthenticated, isLoading: authLoading, logout, refreshUser } = useAuth();

  // Profile Edit State
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  // Password Change State
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  // Sessions State
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [sessionActionId, setSessionActionId] = useState<string | null>(null);

  // Initial user name sync
  useEffect(() => {
    if (user?.name) {
      setNameValue(user.name);
    }
  }, [user?.name]);

  // Route protection
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = '/login?returnTo=/account';
    }
  }, [authLoading, isAuthenticated]);

  // Load active sessions
  const loadSessions = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingSessions(true);
    try {
      const active = await listActiveSessions();
      setSessions(active);
    } catch {
      // Ignored
    } finally {
      setIsLoadingSessions(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    }
  }, [isAuthenticated, loadSessions]);

  const handleSaveName = async () => {
    if (!nameValue.trim() || isSavingName) return;
    setIsSavingName(true);
    const res = await updateProfileName(nameValue.trim());
    setIsSavingName(false);
    if (res.success) {
      await refreshUser();
      setEditingName(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setPasswordFeedback({ success: false, message: 'New password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ success: false, message: 'New passwords do not match.' });
      return;
    }

    setIsSavingPassword(true);
    setPasswordFeedback(null);

    const res = await changePassword(newPassword, oldPassword || undefined);
    setIsSavingPassword(false);

    if (res.success) {
      setPasswordFeedback({ success: true, message: 'Password updated successfully.' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordFeedback(null);
      }, 2500);
    } else {
      setPasswordFeedback({ success: false, message: res.error || 'Failed to update password.' });
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    setSessionActionId(sessionId);
    const res = await revokeSession(sessionId);
    setSessionActionId(null);
    if (res.success) {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    }
  };

  const handleRevokeAllOther = async () => {
    setSessionActionId('all');
    const res = await revokeAllOtherSessions();
    setSessionActionId(null);
    if (res.success) {
      setSessions((prev) => prev.filter((s) => s.current));
    }
  };

  const handleSignOut = async () => {
    await logout();
    window.location.href = '/';
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '2px solid var(--border)',
            borderTopColor: 'var(--cyan)',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div style={{ paddingBottom: 'var(--space-64)' }}>
      <SEOHead path="/account" />

      {/* Header Section */}
      <section
        className="section"
        style={{
          paddingTop: 'var(--space-48)',
          paddingBottom: 'var(--space-28)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container" style={{ maxWidth: '880px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-8)' }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  SYNTAFLOW ACCOUNT CENTER
                </span>
              </div>
              <h1 className="heading-1" style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', color: 'var(--text)', margin: 0 }}>
                Account & Settings
              </h1>
            </div>

            <Button variant="secondary" onClick={handleSignOut} style={{ fontSize: '13px', padding: '7px 14px' }}>
              Sign out
            </Button>
          </div>
        </div>
      </section>

      {/* Body Content */}
      <section className="section" style={{ paddingTop: 'var(--space-32)' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>

            {/* Section 1: User Profile */}
            <Card variant="raised" style={{ padding: 'var(--space-28)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-20)' }}>
                <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                  Profile Information
                </h2>
                {!editingName ? (
                  <button
                    type="button"
                    onClick={() => setEditingName(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--cyan)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Edit Name
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={handleSaveName}
                      disabled={isSavingName}
                      style={{
                        backgroundColor: 'var(--cyan)',
                        color: '#000',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 10px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {isSavingName ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingName(false)}
                      style={{
                        backgroundColor: 'transparent',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        padding: '4px 10px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-20)', fontSize: '13.5px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px', marginBottom: '4px' }}>Name</span>
                  {editingName ? (
                    <input
                      type="text"
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        fontSize: '13.5px',
                        backgroundColor: 'var(--surface-sunken)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        color: 'var(--text)',
                        boxSizing: 'border-box',
                      }}
                    />
                  ) : (
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{user.name}</span>
                  )}
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px', marginBottom: '4px' }}>Email</span>
                  <span style={{ color: 'var(--text)', fontWeight: 500 }}>{user.email}</span>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px', marginBottom: '4px' }}>Syntaflow ID</span>
                  <span style={{ color: 'var(--text-metadata)', fontFamily: 'var(--font-mono)', fontSize: '12.5px' }}>{user.userId}</span>
                </div>
              </div>

              {/* Password Section Toggle */}
              <div style={{ marginTop: 'var(--space-24)', paddingTop: 'var(--space-16)', borderTop: '1px solid var(--border)' }}>
                {!showPasswordForm ? (
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>🔒 Change password</span>
                  </button>
                ) : (
                  <form onSubmit={handleSavePassword} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                      Update Password
                    </div>

                    {passwordFeedback && (
                      <div
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '12.5px',
                          backgroundColor: passwordFeedback.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          border: `1px solid ${passwordFeedback.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                          color: passwordFeedback.success ? '#34D399' : '#F87171',
                        }}
                      >
                        {passwordFeedback.message}
                      </div>
                    )}

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Current Password (if set)
                      </label>
                      <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••••••"
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          fontSize: '13px',
                          backgroundColor: 'var(--surface-sunken)',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          color: 'var(--text)',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        New Password (min 8 chars)
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        minLength={8}
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          fontSize: '13px',
                          backgroundColor: 'var(--surface-sunken)',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          color: 'var(--text)',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        minLength={8}
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          fontSize: '13px',
                          backgroundColor: 'var(--surface-sunken)',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          color: 'var(--text)',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <Button type="submit" variant="primary" disabled={isSavingPassword} style={{ padding: '6px 14px', fontSize: '12.5px' }}>
                        {isSavingPassword ? 'Updating...' : 'Update Password'}
                      </Button>
                      <Button type="button" variant="secondary" onClick={() => setShowPasswordForm(false)} style={{ padding: '6px 14px', fontSize: '12.5px' }}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </Card>

            {/* Section 2: Active Plan */}
            <Card variant="default" style={{ padding: 'var(--space-28)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-16)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                      Plan: {plan.planName}
                    </h2>
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        color: '#10B981',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      ACTIVE ($0)
                    </span>
                  </div>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0, maxWidth: '580px', lineHeight: 1.5 }}>
                    Unconstrained client work management during the preview evaluation period.
                    Includes full local-first SQLite sovereignty, immutable reviews, and OS Keychain encryption.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: 'var(--surface-sunken)',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}
              >
                <div>✓ UNLIMITED CLIENTS</div>
                <div>✓ LOCAL SQLITE VAULT</div>
                <div>✓ IMMUTABLE REVIEWS</div>
                <div>✓ DESKTOP INTEGRATIONS</div>
              </div>
            </Card>

            {/* Section 3: Connected Sessions & Devices */}
            <Card variant="default" style={{ padding: 'var(--space-28)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-16)' }}>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', margin: '0 0 4px 0' }}>
                    Connected Sessions & Devices
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                    Active browsers and desktop instances connected to your Syntaflow account.
                  </p>
                </div>

                {sessions.length > 1 && (
                  <Button
                    variant="secondary"
                    onClick={handleRevokeAllOther}
                    disabled={sessionActionId === 'all'}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    {sessionActionId === 'all' ? 'Revoking...' : 'Sign out all other devices'}
                  </Button>
                )}
              </div>

              {isLoadingSessions ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  Loading connected sessions...
                </div>
              ) : sessions.length === 0 ? (
                <div style={{ padding: '16px', backgroundColor: 'var(--surface-sunken)', borderRadius: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  Current browser session active. No external devices connected.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {sessions.map((sess) => (
                    <div
                      key={sess.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        backgroundColor: 'var(--surface-sunken)',
                        borderRadius: '6px',
                        border: sess.current ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid var(--border)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text)' }}>
                            {sess.osName} · {sess.clientName} {sess.clientVersion}
                          </span>
                          {sess.current && (
                            <span
                              style={{
                                fontSize: '10px',
                                fontFamily: 'var(--font-mono)',
                                padding: '1px 6px',
                                borderRadius: '3px',
                                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                                color: 'var(--cyan)',
                                border: '1px solid rgba(6, 182, 212, 0.3)',
                              }}
                            >
                              CURRENT SESSION
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-metadata)', fontFamily: 'var(--font-mono)' }}>
                          IP: {sess.ip || '127.0.0.1'} {sess.countryName ? `· ${sess.countryName}` : ''}
                        </div>
                      </div>

                      {!sess.current && (
                        <button
                          type="button"
                          onClick={() => handleRevokeSession(sess.id)}
                          disabled={sessionActionId === sess.id}
                          style={{
                            backgroundColor: 'transparent',
                            color: '#F87171',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            borderRadius: '4px',
                            padding: '4px 10px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          {sessionActionId === sess.id ? 'Revoking...' : 'Revoke'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Section 4: Downloads & Desktop Client */}
            <Card variant="default" style={{ padding: 'var(--space-28)' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                Syntaflow Desktop for Windows
              </h2>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: 'var(--space-16)', lineHeight: 1.5 }}>
                Syntaflow runs as a local-first desktop application on Windows. All rates, blueprints, and records live physically on your workstation.
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: 'var(--surface-sunken)',
                  borderRadius: '8px',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                    Syntaflow Desktop v0.1.0-preview.4 (Windows x64)
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-metadata)', marginTop: '2px' }}>
                    SHA-256 verified · Code-signed installer · Offline resilient
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button variant="secondary" href="/auth/desktop" style={{ fontSize: '12.5px', padding: '8px 14px' }}>
                    Authorize Desktop Client
                  </Button>
                  <Button variant="primary" href="/download" style={{ fontSize: '12.5px', padding: '8px 16px' }}>
                    Download Installer
                  </Button>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
};
