import React, { useState, useEffect } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../services/auth/AuthContext';
import { updateProfileName, changePassword } from '../../services/auth/appwriteClient';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [nameValue, setNameValue] = useState(user?.name || '');
  const [editingName, setEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (user?.name) setNameValue(user.name);
  }, [user?.name]);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameValue.trim()) return;
    setIsSavingName(true);
    const res = await updateProfileName(nameValue.trim());
    setIsSavingName(false);
    if (res.success) {
      await refreshUser();
      setEditingName(false);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordFeedback({ success: false, message: 'New password must be at least 8 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ success: false, message: 'Passwords do not match.' });
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
    } else {
      setPasswordFeedback({ success: false, message: res.error || 'Failed to update password.' });
    }
  };

  const userInitial = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <div>
      <SEOHead
        title="Profile & Security — Syntaflow Account"
        description="Manage your Syntaflow profile, display name, and authentication credentials."
        path="/account/profile"
        indexable={false}
      />

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#ffffff', margin: '0 0 0.5rem 0' }}>
          Profile & Security
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
          Manage your account identity, workspace affiliation, and credentials.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '700px' }}>
        {/* Profile Card */}
        <div
          style={{
            padding: '2rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(17, 20, 26, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#ffffff', marginBottom: '1.5rem' }}>
            Account Identity
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 242, 254, 0.15)',
                border: '2px solid rgba(0, 242, 254, 0.4)',
                color: '#00f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 700,
              }}
            >
              {userInitial}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                {user?.name || 'Syntaflow Operator'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {user?.email}
              </div>
            </div>
          </div>

          {nameSuccess && (
            <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', fontSize: '13px', marginBottom: '1rem' }}>
              ✓ Name updated successfully.
            </div>
          )}

          {editingName ? (
            <form onSubmit={handleSaveName} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <Button type="submit" variant="primary" size="md" disabled={isSavingName} style={{ backgroundColor: 'var(--cobalt)' }}>
                {isSavingName ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" variant="secondary" size="md" onClick={() => setEditingName(false)}>
                Cancel
              </Button>
            </form>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Display Name</div>
                <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: 500 }}>{user?.name || 'Not set'}</div>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={() => setEditingName(true)}>
                Edit Name
              </Button>
            </div>
          )}
        </div>

        {/* Change Password Card */}
        <div
          style={{
            padding: '2rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(17, 20, 26, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>
            Change Password
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Update your account password. If you signed in exclusively with Google, you can set a password here to enable direct email sign-in.
          </p>

          {passwordFeedback && (
            <div
              style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: passwordFeedback.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: passwordFeedback.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                color: passwordFeedback.success ? '#34d399' : '#f87171',
                fontSize: '13px',
                marginBottom: '1.25rem',
              }}
            >
              {passwordFeedback.message}
            </div>
          )}

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Current Password (leave blank if first time)
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                New Password (min. 8 characters)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSavingPassword}
              style={{ alignSelf: 'flex-start', marginTop: '0.5rem', backgroundColor: 'var(--cobalt)' }}
            >
              {isSavingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
