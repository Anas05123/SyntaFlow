import { useState, useMemo, useEffect } from 'react';
import { useOverlay } from '../../../ui/overlay';
import { Icon } from '../../../ui/Icon';
import { ServiceLogo } from '../ServiceLogos';
import {
  integrationsService,
  CAPABILITY_RISK_MAP,
  type IntegrationDefinitionWithStatus,
  type IntegrationCategory,
  type CapabilityId,
  type CapabilityRiskClass,
} from '../../../app/integrationsService';

const CATEGORIES: Array<IntegrationCategory | 'All' | 'Connected'> = [
  'All',
  'Connected',
  'Communication',
  'Calendar',
  'Files',
  'Design',
  'Knowledge',
  'Development',
];

export function IntegrationsSettings() {
  const [integrations, setIntegrations] = useState<IntegrationDefinitionWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<IntegrationCategory | 'All' | 'Connected'>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Isolated per-integration action states
  const [connectingIds, setConnectingIds] = useState<Set<string>>(new Set());
  const [testingIds, setTestingIds] = useState<Set<string>>(new Set());
  const [reconnectingIds, setReconnectingIds] = useState<Set<string>>(new Set());
  const [checkingHealthIds, setCheckingHealthIds] = useState<Set<string>>(new Set());
  const [actionErrors, setActionErrors] = useState<Record<string, string | null>>({});
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; latencyMs?: number; message?: string } | null>>({});

  const setConnecting = (id: string, active: boolean) => {
    setConnectingIds((prev) => {
      const next = new Set(prev);
      if (active) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const setTesting = (id: string, active: boolean) => {
    setTestingIds((prev) => {
      const next = new Set(prev);
      if (active) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const setReconnecting = (id: string, active: boolean) => {
    setReconnectingIds((prev) => {
      const next = new Set(prev);
      if (active) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const setCheckingHealth = (id: string, active: boolean) => {
    setCheckingHealthIds((prev) => {
      const next = new Set(prev);
      if (active) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const setActionError = (id: string, error: string | null) => {
    setActionErrors((prev) => ({ ...prev, [id]: error }));
  };

  const setTestResult = (id: string, result: { success: boolean; latencyMs?: number; message?: string } | null) => {
    setTestResults((prev) => ({ ...prev, [id]: result }));
  };

  // Human confirmation gate state
  const [pendingConfirmCap, setPendingConfirmCap] = useState<{
    integrationId: string;
    capabilityId: CapabilityId;
    riskClass: CapabilityRiskClass;
    summary: string;
  } | null>(null);
  const [executingCap, setExecutingCap] = useState(false);

  // Batch connection states
  const [connectingAll, setConnectingAll] = useState(false);
  const [disconnectingAll, setDisconnectingAll] = useState(false);
  const [batchMessage, setBatchMessage] = useState<string | null>(null);

  // Load integration definitions
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const defs = await integrationsService.listDefinitions();
        if (mounted) {
          setIntegrations(defs);
          setLoading(false);
        }
      } catch (_err) {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedIntegration = useMemo(() => {
    if (!selectedId) return null;
    return integrations.find((i) => i.id === selectedId) || null;
  }, [integrations, selectedId]);

  const overlay = useOverlay();

  // Drawer close on Escape via central overlay stack
  useEffect(() => {
    if (!selectedIntegration) return;
    return overlay.registerOverlay({
      id: `integration-drawer-${selectedIntegration.id}`,
      mode: 'drawer',
      isModal: true,
      onClose: () => {
        setSelectedId(null);
      },
    });
  }, [selectedIntegration, overlay]);

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((item) => {
      // Category filter
      if (activeCategory === 'Connected') {
        if (item.status !== 'connected') return false;
      } else if (activeCategory !== 'All') {
        if (item.category !== activeCategory) return false;
      }

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesCapabilities = item.capabilities.some((c: string) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesCapabilities) {
          return false;
        }
      }

      return true;
    });
  }, [integrations, activeCategory, search]);

  const connectedCount = useMemo(
    () => integrations.filter((i) => i.status === 'connected').length,
    [integrations]
  );

  const handleTestConnection = async (id: string) => {
    setTesting(id, true);
    setTestResult(id, null);
    setActionError(id, null);
    try {
      const res = await integrationsService.testConnection(id);
      if (res.success) {
        setTestResult(id, {
          success: true,
          latencyMs: res.latencyMs || 24,
          message: `Connected successfully (${res.latencyMs || 24}ms latency)`,
        });
        const defs = await integrationsService.listDefinitions();
        setIntegrations(defs);
      } else {
        setTestResult(id, {
          success: false,
          message: res.error?.message || 'Connection test failed',
        });
      }
    } catch (err: any) {
      setTestResult(id, {
        success: false,
        message: err.message || 'Connection error',
      });
    } finally {
      setTesting(id, false);
    }
  };

  const handleConnect = async (id: string, options?: Record<string, unknown>) => {
    setConnecting(id, true);
    setActionError(id, null);
    try {
      const res = await integrationsService.connect(id, options);
      if (res.success && res.connection) {
        const defs = await integrationsService.listDefinitions();
        setIntegrations(defs);
      } else {
        // If cancelled by user, do not display error banner
        if (res.error?.code !== 'authorization_cancelled') {
          setActionError(id, res.error?.message || 'Failed to authorize connection.');
        }
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('cancelled')) {
        setActionError(id, err.message || 'Connection attempt failed.');
      }
    } finally {
      setConnecting(id, false);
    }
  };

  const handleConnectAll = async () => {
    setConnectingAll(true);
    setBatchMessage('Connecting all services...');
    try {
      const res = await integrationsService.connectAll();
      const defs = await integrationsService.listDefinitions();
      setIntegrations(defs);
      const count = res.connectedCount || defs.filter((d) => d.status === 'connected').length;
      setBatchMessage(`Connected all ${count} integrations successfully!`);
      setTimeout(() => setBatchMessage(null), 5000);
    } catch (err: any) {
      setBatchMessage(err.message || 'Failed to connect all.');
      setTimeout(() => setBatchMessage(null), 5000);
    } finally {
      setConnectingAll(false);
    }
  };

  const handleDisconnectAll = async () => {
    setDisconnectingAll(true);
    setBatchMessage('Disconnecting all services...');
    try {
      await integrationsService.disconnectAll();
      const defs = await integrationsService.listDefinitions();
      setIntegrations(defs);
      setBatchMessage('All integrations disconnected.');
      setTimeout(() => setBatchMessage(null), 4000);
    } catch (err: any) {
      setBatchMessage(err.message || 'Failed to disconnect all.');
      setTimeout(() => setBatchMessage(null), 4000);
    } finally {
      setDisconnectingAll(false);
    }
  };

  const handleCancelConnect = async (id: string) => {
    // 1. Immediately reset UI state (<1ms)
    setConnecting(id, false);
    setActionError(id, null);

    // 2. Abort in-flight backend loopback listener
    try {
      await integrationsService.cancelConnect(id);
      const defs = await integrationsService.listDefinitions();
      setIntegrations(defs);
    } catch (_err) {}
  };

  const handleDisconnect = async (id: string) => {
    setConnecting(id, false);
    setActionError(id, null);
    try {
      const res = await integrationsService.disconnect(id);
      if (res.success) {
        const defs = await integrationsService.listDefinitions();
        setIntegrations(defs);
        setTestResult(id, null);
      } else {
        setActionError(id, res.error?.message || 'Failed to disconnect.');
      }
    } catch (err: any) {
      setActionError(id, err.message || 'Disconnection error.');
    }
  };

  const handleReconnect = async (id: string) => {
    setReconnecting(id, true);
    setActionError(id, null);
    try {
      const res = await integrationsService.reconnect(id);
      if (res.success) {
        const defs = await integrationsService.listDefinitions();
        setIntegrations(defs);
        setTestResult(id, {
          success: true,
          message: 'Connection re-established successfully',
        });
      } else {
        setActionError(id, res.error?.message || 'Failed to reconnect.');
      }
    } catch (err: any) {
      setActionError(id, err.message || 'Reconnection attempt failed.');
    } finally {
      setReconnecting(id, false);
    }
  };

  const handleCheckHealth = async (id: string) => {
    setCheckingHealth(id, true);
    setActionError(id, null);
    try {
      const res = (await integrationsService.checkHealth(id, true)) as any;
      if (res?.reachable) {
        setTestResult(id, {
          success: true,
          latencyMs: res.latencyMs || 24,
          message: `Health status: ${res.status || 'healthy'} (${res.latencyMs || 24}ms latency)`,
        });
      } else {
        setTestResult(id, {
          success: false,
          message: `Health check: ${res?.status || 'unreachable'} - ${res?.error?.message || 'Service did not respond'}`,
        });
      }
      const defs = await integrationsService.listDefinitions();
      setIntegrations(defs);
    } catch (err: any) {
      setActionError(id, err.message || 'Health check error.');
    } finally {
      setCheckingHealth(id, false);
    }
  };

  const handleExecuteHighRiskCapability = (integrationId: string, cap: CapabilityId) => {
    const risk = CAPABILITY_RISK_MAP[cap];
    if (risk?.requiresConfirmation) {
      setPendingConfirmCap({
        integrationId,
        capabilityId: cap,
        riskClass: risk.riskClass,
        summary: risk.summary,
      });
      return;
    }
    executeCapabilityAction(integrationId, cap, false);
  };

  const executeCapabilityAction = async (integrationId: string, cap: CapabilityId, confirmed: boolean) => {
    setExecutingCap(true);
    setActionError(integrationId, null);
    try {
      const res = await integrationsService.executeCapability(cap, {
        integrationId,
        _confirmedByHuman: confirmed,
      });
      if (res.success) {
        setTestResult(integrationId, {
          success: true,
          message: `Capability "${cap}" executed successfully.`,
        });
        setPendingConfirmCap(null);
      } else if (res.requiresConfirmation) {
        setPendingConfirmCap({
          integrationId,
          capabilityId: cap,
          riskClass: res.riskClass || 'EXTERNAL_ACTION',
          summary: CAPABILITY_RISK_MAP[cap]?.summary || 'Requires human verification before execution.',
        });
      } else {
        setActionError(integrationId, res.error?.message || `Execution of "${cap}" failed.`);
      }
    } catch (err: any) {
      setActionError(integrationId, err.message || 'Execution error.');
    } finally {
      setExecutingCap(false);
    }
  };

  const handleToggleAgentAccess = async (id: string, enabled: boolean) => {
    if (!selectedIntegration || !selectedIntegration.connection) return;
    const currentAccess = selectedIntegration.connection.agentAccess || {
      enabled: false,
      allowedCapabilities: [],
    };
    const updated = {
      ...currentAccess,
      enabled,
      allowedCapabilities: enabled && currentAccess.allowedCapabilities.length === 0
        ? selectedIntegration.capabilities.slice(0, 2)
        : currentAccess.allowedCapabilities,
    };
    await integrationsService.updateAgentAccess(id, updated);
    const defs = await integrationsService.listDefinitions();
    setIntegrations(defs);
  };

  const handleToggleCapability = async (id: string, cap: CapabilityId) => {
    if (!selectedIntegration || !selectedIntegration.connection) return;
    const currentAccess = selectedIntegration.connection.agentAccess || {
      enabled: true,
      allowedCapabilities: [],
    };
    const isAllowed = currentAccess.allowedCapabilities.includes(cap);
    const updatedCapabilities = isAllowed
      ? currentAccess.allowedCapabilities.filter((c) => c !== cap)
      : [...currentAccess.allowedCapabilities, cap];

    const updated = {
      ...currentAccess,
      allowedCapabilities: updatedCapabilities,
    };
    await integrationsService.updateAgentAccess(id, updated);
    const defs = await integrationsService.listDefinitions();
    setIntegrations(defs);
  };

  return (
    <div className="cd-integrations-page">
      {/* Header */}
      <div className="cd-integrations-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 className="cd-integrations-title">Integrations Directory</h2>
          <p className="cd-integrations-subtitle">
            Connect official third-party services and configure Model Context Protocol (MCP) agents.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {connectedCount > 1 && (
            <button
              type="button"
              className="cd-settings-btn secondary"
              onClick={handleDisconnectAll}
              disabled={disconnectingAll || connectingAll}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              {disconnectingAll ? 'Disconnecting...' : 'Disconnect All'}
            </button>
          )}
          <button
            type="button"
            className="cd-settings-btn primary"
            onClick={handleConnectAll}
            disabled={connectingAll || disconnectingAll}
            style={{
              padding: '6px 14px',
              fontSize: '12.5px',
              background: '#2563EB',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {connectingAll ? (
              <>
                <span className="cd-integration-spinner" />
                <span>Connecting All...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Connect All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Batch Operation Feedback */}
      {batchMessage && (
        <div
          style={{
            padding: '10px 14px',
            marginBottom: '14px',
            borderRadius: '6px',
            fontSize: '12.5px',
            background: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            color: '#34D399',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icon name="check" size={16} />
          <span>{batchMessage}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="cd-integrations-search-bar">
        <Icon name="search" size={16} className="cd-integrations-search-icon" />
        <input
          type="text"
          className="cd-integrations-search-input"
          placeholder="Search external integrations, capabilities, or tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            className="cd-integrations-search-clear"
            onClick={() => setSearch('')}
            aria-label="Clear search"
          >
            <Icon name="close" size={14} />
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="cd-integrations-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`cd-integrations-filter-pill ${activeCategory === cat ? 'is-active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Compact Cards (72-88px height) */}
      <div className="cd-integrations-grid">
        {filteredIntegrations.map((item) => {
          const isConnectingThis = connectingIds.has(item.id);
          return (
            <div
              key={item.id}
              className="cd-integration-card"
              onClick={() => {
                setSelectedId(item.id);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedId(item.id);
                }
              }}
            >
              <div className="cd-integration-card-left">
                <div className="cd-integration-card-logo">
                  <ServiceLogo name={item.logo} size={30} />
                </div>
                <div className="cd-integration-card-info">
                  <span className="cd-integration-card-name">{item.name}</span>
                  <span className="cd-integration-card-desc">{item.description}</span>
                </div>
              </div>

              <div className="cd-integration-card-right">
                {isConnectingThis ? (
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="cd-integration-status-connected" style={{ color: '#38BDF8', fontSize: '12.5px' }}>
                      <span className="cd-integration-dot" style={{ background: '#38BDF8', boxShadow: '0 0 6px rgba(56, 189, 248, 0.6)' }} />
                      Authorizing...
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelConnect(item.id);
                      }}
                      title={`Cancel ${item.name} authorization`}
                      style={{
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.35)',
                        color: '#F87171',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : item.status === 'connected' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                    <span className="cd-integration-status-connected">
                      <span className="cd-integration-dot" />
                      Connected
                    </span>
                    {item.connection?.accountLabel && (
                      <span
                        title={item.connection.accountLabel}
                        style={{
                          fontSize: '11px',
                          color: '#94A3B8',
                          maxWidth: '140px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.connection.accountLabel}
                      </span>
                    )}
                  </div>
                ) : item.status === 'connecting' ? (
                  <span className="cd-integration-status-connected" style={{ color: '#38BDF8' }}>
                    <span className="cd-integration-dot" style={{ background: '#38BDF8', boxShadow: '0 0 6px rgba(56, 189, 248, 0.6)' }} />
                    Connecting...
                  </span>
                ) : item.status === 'degraded' ? (
                  <span className="cd-integration-status-connected" style={{ color: '#F59E0B' }}>
                    <span className="cd-integration-dot" style={{ background: '#F59E0B', boxShadow: '0 0 6px rgba(245, 158, 11, 0.6)' }} />
                    Degraded
                  </span>
                ) : item.status === 'offline' ? (
                  <span className="cd-integration-status-connected" style={{ color: '#94A3B8' }}>
                    <span className="cd-integration-dot" style={{ background: '#64748B', boxShadow: '0 0 6px rgba(100, 116, 139, 0.4)' }} />
                    Offline
                  </span>
                ) : item.status === 'auth-expired' ? (
                  <span className="cd-integration-status-connected" style={{ color: '#F87171' }}>
                    <span className="cd-integration-dot" style={{ background: '#EF4444', boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)' }} />
                    Auth Expired
                  </span>
                ) : item.status === 'permission-required' ? (
                  <span className="cd-integration-status-connected" style={{ color: '#F59E0B' }}>
                    <span className="cd-integration-dot" style={{ background: '#F59E0B', boxShadow: '0 0 6px rgba(245, 158, 11, 0.6)' }} />
                    Permissions
                  </span>
                ) : item.status === 'error' ? (
                  <span className="cd-integration-status-connected" style={{ color: '#F87171' }}>
                    <span className="cd-integration-dot" style={{ background: '#EF4444', boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)' }} />
                    Error
                  </span>
                ) : item.status === 'test' || item.status === 'beta' ? (
                  <span className="cd-integration-badge-beta" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#818CF8', borderColor: 'rgba(99, 102, 241, 0.3)' }}>TEST</span>
                ) : item.status === 'coming-soon' ? (
                  <span className="cd-integration-status-soon">Coming soon</span>
                ) : (
                  <button
                    type="button"
                    className="cd-integration-btn-connect"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnect(item.id);
                    }}
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredIntegrations.length === 0 && !loading && (
        <div className="cd-integrations-empty">
          <Icon name="search" size={24} />
          <span>No integrations matching "{search}" in {activeCategory}</span>
        </div>
      )}

      {/* Integration Detail Drawer */}
      {selectedIntegration && (
        <div
          className="cd-integration-drawer-scrim"
          onClick={() => {
            setSelectedId(null);
          }}
        >
          <div
            className="cd-integration-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={`${selectedIntegration.name} details`}
          >
            {/* Drawer Header */}
            <div className="cd-integration-drawer-header">
              <div className="cd-integration-drawer-header-left">
                <ServiceLogo name={selectedIntegration.logo} size={36} />
                <div>
                  <h3 className="cd-integration-drawer-title">{selectedIntegration.name}</h3>
                  <div className="cd-integration-drawer-sub">
                    {selectedIntegration.category} &bull;{' '}
                    <a
                      href={selectedIntegration.website}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#38BDF8', textDecoration: 'none' }}
                    >
                      Visit website
                    </a>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="cd-integration-drawer-close"
                onClick={() => {
                  setSelectedId(null);
                }}
                aria-label="Close drawer"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="cd-integration-drawer-body">
              {/* Error Banner */}
              {actionErrors[selectedIntegration.id] && (
                <div className="cd-integration-error-banner">
                  <span style={{ color: '#f87171' }}><Icon name="alert" size={16} /></span>
                  <span>{actionErrors[selectedIntegration.id]}</span>
                </div>
              )}

              {/* Status Section */}
              <div className="cd-integration-drawer-section">
                <span className="cd-integration-drawer-section-title">Connection Status</span>
                <div className="cd-integration-drawer-status-card">
                  <div className="cd-integration-drawer-status-line">
                    {connectingIds.has(selectedIntegration.id) ? (
                      <span className="cd-integration-status-connected" style={{ color: '#38BDF8' }}>
                        <span className="cd-integration-dot" style={{ background: '#38BDF8', boxShadow: '0 0 6px rgba(56, 189, 248, 0.6)' }} />
                        Authorizing with browser...
                      </span>
                    ) : selectedIntegration.status === 'connected' ? (
                      <span className="cd-integration-status-connected">
                        <span className="cd-integration-dot" />
                        Connected
                      </span>
                    ) : selectedIntegration.status === 'connecting' ? (
                      <span className="cd-integration-status-connected" style={{ color: '#38BDF8' }}>
                        <span className="cd-integration-dot" style={{ background: '#38BDF8', boxShadow: '0 0 6px rgba(56, 189, 248, 0.6)' }} />
                        Connecting...
                      </span>
                    ) : selectedIntegration.status === 'degraded' ? (
                      <span className="cd-integration-status-connected" style={{ color: '#F59E0B' }}>
                        <span className="cd-integration-dot" style={{ background: '#F59E0B', boxShadow: '0 0 6px rgba(245, 158, 11, 0.6)' }} />
                        Degraded Performance
                      </span>
                    ) : selectedIntegration.status === 'offline' ? (
                      <span className="cd-integration-status-connected" style={{ color: '#94A3B8' }}>
                        <span className="cd-integration-dot" style={{ background: '#64748B', boxShadow: '0 0 6px rgba(100, 116, 139, 0.4)' }} />
                        Offline / Network Unreachable
                      </span>
                    ) : selectedIntegration.status === 'auth-expired' ? (
                      <span className="cd-integration-status-connected" style={{ color: '#F87171' }}>
                        <span className="cd-integration-dot" style={{ background: '#EF4444', boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)' }} />
                        Authorization Expired
                      </span>
                    ) : selectedIntegration.status === 'permission-required' ? (
                      <span className="cd-integration-status-connected" style={{ color: '#F59E0B' }}>
                        <span className="cd-integration-dot" style={{ background: '#F59E0B', boxShadow: '0 0 6px rgba(245, 158, 11, 0.6)' }} />
                        Permission Approval Required
                      </span>
                    ) : selectedIntegration.status === 'error' ? (
                      <span className="cd-integration-status-connected" style={{ color: '#F87171' }}>
                        <span className="cd-integration-dot" style={{ background: '#EF4444', boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)' }} />
                        Connection Error
                      </span>
                    ) : selectedIntegration.status === 'test' || selectedIntegration.status === 'beta' ? (
                      <span className="cd-integration-badge-beta" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#818CF8', borderColor: 'rgba(99, 102, 241, 0.3)' }}>TEST Mode</span>
                    ) : selectedIntegration.status === 'coming-soon' ? (
                      <span className="cd-integration-status-soon">Coming soon</span>
                    ) : (
                      <span style={{ color: '#94A3B8', fontSize: '12px' }}>Not connected</span>
                    )}
                  </div>

                  {selectedIntegration.connection?.accountLabel && (
                    <div style={{ marginTop: '8px', fontSize: '13px', color: '#E2E8F0' }}>
                      <span style={{ color: '#94A3B8' }}>Account: </span>
                      <strong style={{ color: '#38BDF8', fontWeight: 600 }}>{selectedIntegration.connection.accountLabel}</strong>
                      {selectedIntegration.connection.accountEmail &&
                        selectedIntegration.connection.accountEmail !== selectedIntegration.connection.accountLabel && (
                          <span style={{ color: '#94A3B8', fontSize: '12px', marginLeft: '6px' }}>
                            ({selectedIntegration.connection.accountEmail})
                          </span>
                        )}
                    </div>
                  )}

                  {selectedIntegration.connection?.lastCheckedAt && (
                    <div style={{ marginTop: '4px', fontSize: '11.5px', color: '#64748B' }}>
                      Last verified: {new Date(selectedIntegration.connection.lastCheckedAt).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Connection Architecture Details */}
              <div className="cd-integration-drawer-section">
                <span className="cd-integration-drawer-section-title">Architecture & Transports</span>
                <div className="cd-integration-drawer-status-card" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '12.5px', color: '#CBD5E1' }}>
                    <span style={{ color: '#94A3B8' }}>Primary Transport: </span>
                    <strong style={{ color: '#38BDF8', textTransform: 'uppercase' }}>{selectedIntegration.primaryTransport}</strong>
                  </div>
                  {selectedIntegration.mcpDetails && (
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                      <span style={{ color: '#64748B' }}>MCP Support: </span>
                      {selectedIntegration.mcpDetails.notes}
                    </div>
                  )}
                  {selectedIntegration.apiDetails?.endpoint && (
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                      <span style={{ color: '#64748B' }}>Endpoint: </span>
                      <code style={{ fontSize: '11px', background: 'rgba(255,255,255,0.06)', padding: '2px 4px', borderRadius: '4px' }}>
                        {selectedIntegration.apiDetails.endpoint}
                      </code>
                    </div>
                  )}
                </div>
              </div>

              {/* Capabilities Checklist with Risk Classification */}
              <div className="cd-integration-drawer-section">
                <span className="cd-integration-drawer-section-title">Syntaflow Capabilities & Risk Tiers</span>
                <div className="cd-integration-drawer-perms">
                  {selectedIntegration.capabilities.map((cap: CapabilityId) => {
                    const risk = CAPABILITY_RISK_MAP[cap] || { riskClass: 'READ', requiresConfirmation: false, summary: '' };
                    const riskColor =
                      risk.riskClass === 'DESTRUCTIVE'
                        ? '#EF4444'
                        : risk.riskClass === 'EXTERNAL_ACTION'
                        ? '#F59E0B'
                        : risk.riskClass === 'WRITE'
                        ? '#60A5FA'
                        : '#34D399';

                    return (
                      <div
                        key={cap}
                        className="cd-integration-drawer-perm-item"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: riskColor, display: 'inline-flex' }}>
                            <Icon name="check" size={14} />
                          </span>
                          <span style={{ fontSize: '13px', color: '#E2E8F0' }}>{cap}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '0.04em',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: `rgba(${
                                risk.riskClass === 'DESTRUCTIVE'
                                  ? '239, 68, 68'
                                  : risk.riskClass === 'EXTERNAL_ACTION'
                                  ? '245, 158, 11'
                                  : risk.riskClass === 'WRITE'
                                  ? '96, 165, 250'
                                  : '52, 211, 153'
                              }, 0.12)`,
                              color: riskColor,
                              border: `1px solid rgba(${
                                risk.riskClass === 'DESTRUCTIVE'
                                  ? '239, 68, 68'
                                  : risk.riskClass === 'EXTERNAL_ACTION'
                                  ? '245, 158, 11'
                                  : risk.riskClass === 'WRITE'
                                  ? '96, 165, 250'
                                  : '52, 211, 153'
                              }, 0.25)`,
                            }}
                          >
                            {risk.riskClass}
                          </span>
                          {selectedIntegration.status === 'connected' && (
                            <button
                              type="button"
                              onClick={() => handleExecuteHighRiskCapability(selectedIntegration.id, cap)}
                              disabled={executingCap}
                              style={{
                                background: 'transparent',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#94A3B8',
                                fontSize: '11px',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                              title={`Execute ${cap}`}
                            >
                              Run
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {selectedIntegration.capabilities.length === 0 && (
                    <div style={{ fontSize: '12.5px', color: '#64748B' }}>No normalized capabilities configured yet.</div>
                  )}
                </div>
              </div>

              {/* Required Scopes */}
              <div className="cd-integration-drawer-section">
                <span className="cd-integration-drawer-section-title">Required Permissions & Scopes</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedIntegration.scopes.map((scope: string) => (
                    <span key={scope} className="cd-integration-scope-pill">
                      {scope}
                    </span>
                  ))}
                </div>
              </div>

              {/* In-Product Privacy & Data-Use Disclosure (Google Limited Use Compliance) */}
              <div
                style={{
                  margin: '12px 0',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  border: '1px solid rgba(37, 99, 235, 0.25)',
                  borderRadius: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, fontFamily: 'monospace', color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    DATA USE & PRIVACY DISCLOSURE
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: 1.5, margin: 0 }}>
                  {selectedIntegration.id.startsWith('google') || selectedIntegration.id === 'gmail' ? (
                    <>
                      <strong>Google User Data:</strong> Syntaflow requests only the minimum permissions necessary to view client emails, schedule milestone sessions, and attach deliverables. Your Google data is processed locally on your device, is never sold or used for advertising, and is <strong>never used to train generalized AI models</strong> in strict compliance with the Google API Services User Data Policy.
                    </>
                  ) : (
                    <>
                      Syntaflow accesses only the specific data designated above to coordinate client work. Tokens are encrypted using your operating system keychain and data is retrieved on demand without cloud telemetry leaks.
                    </>
                  )}
                </p>
                <div style={{ marginTop: '6px' }}>
                  <a
                    href="https://syntaflow.tech/privacy"
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '11.5px', color: '#38BDF8', textDecoration: 'underline' }}
                  >
                    Read our complete Privacy Policy at syntaflow.tech/privacy &rarr;
                  </a>
                </div>
              </div>

              {/* Agent Access Controller */}
              {selectedIntegration.agentAccessSupported && selectedIntegration.status === 'connected' && (
                <div className="cd-integration-drawer-section">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="cd-integration-drawer-section-title">Agent Access Control</span>
                    <button
                      type="button"
                      className={`cd-integration-agent-toggle ${selectedIntegration.connection?.agentAccess?.enabled ? 'active' : ''}`}
                      onClick={() =>
                        handleToggleAgentAccess(
                          selectedIntegration.id,
                          !selectedIntegration.connection?.agentAccess?.enabled
                        )
                      }
                    >
                      {selectedIntegration.connection?.agentAccess?.enabled ? 'Agent Access: On' : 'Agent Access: Off'}
                    </button>
                  </div>

                  <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 8px 0' }}>
                    Control which actions Syntaflow AI agents may perform with this connection.
                  </p>

                  {selectedIntegration.connection?.agentAccess?.enabled && (
                    <div className="cd-integration-agent-caps">
                      {selectedIntegration.capabilities.map((cap: CapabilityId) => {
                        const isAllowed =
                          selectedIntegration.connection?.agentAccess?.allowedCapabilities.includes(cap);
                        const isElevated = cap === 'mail.send';

                        return (
                          <label key={cap} className="cd-integration-agent-cap-row">
                            <input
                              type="checkbox"
                              checked={isAllowed}
                              onChange={() => handleToggleCapability(selectedIntegration.id, cap)}
                            />
                            <span style={{ fontSize: '13px', color: '#E2E8F0' }}>{cap}</span>
                            {isElevated && (
                              <span className="cd-integration-elevated-badge">
                                Elevated Confirmation
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Actions & Connection Controls */}
              <div className="cd-integration-drawer-actions">
                {connectingIds.has(selectedIntegration.id) ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
                    <button
                      type="button"
                      className="cd-settings-btn primary"
                      disabled={true}
                      style={{ opacity: 0.85, cursor: 'wait', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          width: '12px',
                          height: '12px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#ffffff',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }}
                      />
                      Authorizing with browser...
                    </button>
                    <button
                      type="button"
                      className="cd-settings-btn secondary"
                      onClick={() => handleCancelConnect(selectedIntegration.id)}
                      style={{
                        borderColor: 'rgba(239, 68, 68, 0.4)',
                        color: '#F87171',
                        background: 'rgba(239, 68, 68, 0.08)',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : selectedIntegration.status === 'connected' ? (
                  <>
                    <button
                      type="button"
                      className="cd-settings-btn secondary"
                      onClick={() => handleTestConnection(selectedIntegration.id)}
                      disabled={testingIds.has(selectedIntegration.id)}
                    >
                      {testingIds.has(selectedIntegration.id) ? 'Testing connection...' : 'Test connection'}
                    </button>
                    <button
                      type="button"
                      className="cd-settings-btn secondary"
                      onClick={() => handleCheckHealth(selectedIntegration.id)}
                      disabled={checkingHealthIds.has(selectedIntegration.id)}
                    >
                      {checkingHealthIds.has(selectedIntegration.id) ? 'Checking health...' : 'Check health'}
                    </button>
                    <button
                      type="button"
                      className="cd-settings-btn danger"
                      onClick={() => handleDisconnect(selectedIntegration.id)}
                    >
                      Disconnect
                    </button>
                  </>
                ) : selectedIntegration.status === 'auth-expired' ? (
                  <>
                    <button
                      type="button"
                      className="cd-settings-btn primary"
                      onClick={() => handleConnect(selectedIntegration.id)}
                    >
                      Re-authenticate
                    </button>
                    <button
                      type="button"
                      className="cd-settings-btn danger"
                      onClick={() => handleDisconnect(selectedIntegration.id)}
                    >
                      Disconnect
                    </button>
                  </>
                ) : selectedIntegration.status === 'degraded' || selectedIntegration.status === 'offline' ? (
                  <>
                    <button
                      type="button"
                      className="cd-settings-btn primary"
                      onClick={() => handleReconnect(selectedIntegration.id)}
                      disabled={reconnectingIds.has(selectedIntegration.id)}
                    >
                      {reconnectingIds.has(selectedIntegration.id) ? 'Reconnecting...' : 'Reconnect'}
                    </button>
                    <button
                      type="button"
                      className="cd-settings-btn secondary"
                      onClick={() => handleCheckHealth(selectedIntegration.id)}
                      disabled={checkingHealthIds.has(selectedIntegration.id)}
                    >
                      {checkingHealthIds.has(selectedIntegration.id) ? 'Checking health...' : 'Check health'}
                    </button>
                    <button
                      type="button"
                      className="cd-settings-btn danger"
                      onClick={() => handleDisconnect(selectedIntegration.id)}
                    >
                      Disconnect
                    </button>
                  </>
                ) : connectingIds.has(selectedIntegration.id) ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="cd-integration-status-authorizing">
                      <span className="cd-integration-spinner" />
                      Authorizing with browser...
                    </span>
                    <button
                      type="button"
                      className="cd-settings-btn secondary"
                      onClick={() => handleCancelConnect(selectedIntegration.id)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    {['google-calendar', 'gmail', 'google-drive', 'github', 'notion', 'linear'].includes(selectedIntegration.id) ? (
                      <button
                        type="button"
                        className="cd-settings-btn primary"
                        onClick={() => handleConnect(selectedIntegration.id)}
                      >
                        Connect {selectedIntegration.name}
                      </button>
                    ) : selectedIntegration.status === 'coming-soon' ? (
                      <div style={{ fontSize: '12.5px', color: '#94A3B8', padding: '12px 0' }}>
                        This service is on the Syntaflow roadmap and will be available in an upcoming release.
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="cd-settings-btn secondary"
                        onClick={() => handleConnect(selectedIntegration.id)}
                      >
                        Configure {selectedIntegration.name}
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Test Result Feedback */}
              {testResults[selectedIntegration.id] && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    background: testResults[selectedIntegration.id]?.success ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${testResults[selectedIntegration.id]?.success ? 'rgba(52, 211, 153, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    color: testResults[selectedIntegration.id]?.success ? '#34D399' : '#F87171',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ display: 'inline-flex' }}>
                    <Icon name={testResults[selectedIntegration.id]?.success ? 'check' : 'alert'} size={16} />
                  </span>
                  <span>{testResults[selectedIntegration.id]?.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Human Confirmation Gate Modal */}
      {pendingConfirmCap && (
        <div
          className="cd-integration-drawer-scrim"
          style={{ zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setPendingConfirmCap(null)}
        >
          <div
            style={{
              background: '#15191D',
              border: '1px solid #333C48',
              borderRadius: '10px',
              padding: '24px',
              maxWidth: '480px',
              width: '90%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-gate-title"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span style={{ color: '#F59E0B', display: 'flex' }}>
                <Icon name="alert" size={24} />
              </span>
              <h3 id="confirm-gate-title" style={{ margin: 0, fontSize: '17px', color: '#fff', fontWeight: 600 }}>
                High-Risk Capability Confirmation
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              Syntaflow requires explicit human confirmation before executing{' '}
              <code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px', color: '#38BDF8' }}>
                {pendingConfirmCap.capabilityId}
              </code>
              . This action carries{' '}
              <strong style={{ color: pendingConfirmCap.riskClass === 'DESTRUCTIVE' ? '#EF4444' : '#F59E0B' }}>
                {pendingConfirmCap.riskClass}
              </strong>{' '}
              risk:
            </p>
            <div
              style={{
                padding: '10px 12px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '6px',
                fontSize: '12.5px',
                color: '#94A3B8',
                marginBottom: '20px',
                borderLeft: `3px solid ${pendingConfirmCap.riskClass === 'DESTRUCTIVE' ? '#EF4444' : '#F59E0B'}`,
              }}
            >
              {pendingConfirmCap.summary}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="cd-settings-btn secondary"
                onClick={() => setPendingConfirmCap(null)}
                disabled={executingCap}
              >
                Cancel
              </button>
              <button
                type="button"
                className="cd-settings-btn primary"
                style={{
                  background: pendingConfirmCap.riskClass === 'DESTRUCTIVE' ? '#DC2626' : '#2563EB',
                }}
                onClick={() =>
                  executeCapabilityAction(
                    pendingConfirmCap.integrationId,
                    pendingConfirmCap.capabilityId,
                    true
                  )
                }
                disabled={executingCap}
              >
                {executingCap ? 'Authorizing...' : 'Authorize & Execute'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

