import React, { useState, useEffect, useCallback } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../services/auth/AuthContext';
import type { DeviceSession } from '../../types/auth';
import { listActiveSessions, revokeSession, revokeAllOtherSessions } from '../../services/auth/appwriteClient';

export const SessionsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const active = await listActiveSessions();
      setSessions(active);
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    }
  }, [isAuthenticated, loadSessions]);

  const handleRevokeSession = async (sessionId: string) => {
    setRevokingId(sessionId);
    const res = await revokeSession(sessionId);
    setRevokingId(null);
    if (res.success) {
      setActionMessage('Session revoked.');
      await loadSessions();
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const handleRevokeAllOther = async () => {
    setIsLoading(true);
    const res = await revokeAllOtherSessions();
    setIsLoading(false);
    if (res.success) {
      setActionMessage('All other sessions signed out.');
      await loadSessions();
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const currentSession = sessions.find((s) => s.current);
  const otherSessions = sessions.filter((s) => !s.current);

  return (
    <div>
      <SEOHead
        title="Active Sessions — Syntaflow Account"
        description="Review and manage active web and desktop sessions logged into your Syntaflow account."
        path="/account/sessions"
        indexable={false}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#ffffff', margin: '0 0 0.5rem 0' }}>
            Active Sessions
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            Devices and browsers currently authorized to access your Syntaflow workspace.
          </p>
        </div>

        {otherSessions.length > 0 && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleRevokeAllOther}
            disabled={isLoading}
            style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          >
            Revoke All Other Sessions
          </Button>
        )}
      </div>

      {actionMessage && (
        <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', fontSize: '13px', marginBottom: '1.5rem' }}>
          ✓ {actionMessage}
        </div>
      )}

      {isLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          Loading active device sessions...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
          {/* Current Device */}
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              This Device (Active Now)
            </div>

            {currentSession ? (
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(17, 20, 26, 0.85)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 20px rgba(0, 242, 254, 0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(0, 242, 254, 0.1)',
                      color: '#00f2fe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>
                        {currentSession.clientName || 'Syntaflow Browser'} {currentSession.clientVersion}
                      </span>
                      <span style={{ padding: '2px 8px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '11px', fontWeight: 600 }}>
                        Current
                      </span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {currentSession.osName} {currentSession.deviceModel ? `· ${currentSession.deviceModel}` : ''}
                      {currentSession.countryName ? ` · ${currentSession.countryName}` : ''}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Current session active.</div>
            )}
          </div>

          {/* Other Devices */}
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Other Active Sessions ({otherSessions.length})
            </div>

            {otherSessions.length === 0 ? (
              <div style={{ padding: '1.5rem', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', color: 'var(--text-tertiary)', fontSize: '13px' }}>
                No other devices or browsers are currently logged into your account.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {otherSessions.map((session) => (
                  <div
                    key={session.id}
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(17, 20, 26, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                          <line x1="8" y1="21" x2="16" y2="21" />
                          <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>
                          {session.clientName || 'Syntaflow Session'} {session.clientVersion}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {session.osName} {session.deviceModel ? `· ${session.deviceModel}` : ''}
                          {session.lastActivity ? ` · Active ${new Date(session.lastActivity).toLocaleDateString()}` : ''}
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                      disabled={revokingId === session.id}
                      style={{ color: '#f87171' }}
                    >
                      {revokingId === session.id ? 'Revoking...' : 'Revoke'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
