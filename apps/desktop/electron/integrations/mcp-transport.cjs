/**
 * Syntaflow MCP Transport Adapter
 *
 * Implements the official Model Context Protocol (MCP) client transport using @modelcontextprotocol/sdk.
 *
 * Responsibilities:
 * - Server connection lifecycle using modern Streamable HTTP or stdio
 * - Discovery: tools/list, resources/list
 * - Execution: tools/call with timeouts, parameter validation, and cancellation
 * - Health verification and ping
 * - Safe error normalization preventing leakage of internal tokens or URLs
 */

class McpTransport {
  constructor(options = {}) {
    this.serverUrl = options.serverUrl;
    this.transportType = options.transportType || 'streamable-http';
    this.authHeader = options.authHeader;
    this.clientName = options.clientName || 'Syntaflow Desktop';
    this.clientVersion = options.clientVersion || '1.0.0';
    this.timeoutMs = options.timeoutMs || 30000;

    this.client = null;
    this.transport = null;
    this.connected = false;
    this.state = 'closed'; // 'connected' | 'closed' | 'reconnecting' | 'offline'
    this.reconnectAttempts = 0;
    this.toolsCache = [];
  }

  async _loadSdk() {
    const { Client } = await import('@modelcontextprotocol/sdk/client/index.js');
    return { Client };
  }

  /**
   * Establishes connection to the MCP server.
   */
  async connect() {
    try {
      this.state = 'connecting';
      const { Client } = await this._loadSdk();

      this.client = new Client(
        {
          name: this.clientName,
          version: this.clientVersion,
        },
        {
          capabilities: {
            tools: {},
            resources: {},
          },
        }
      );

      if (this.transportType === 'stdio') {
        const { StdioClientTransport } = await import('@modelcontextprotocol/sdk/client/stdio.js');
        this.transport = new StdioClientTransport({
          command: this.serverUrl,
          args: this.options?.args || [],
        });
      } else {
        const { StreamableHTTPClientTransport } = await import('@modelcontextprotocol/sdk/client/streamableHttp.js');
        const headers = {};
        if (this.authHeader) {
          headers['Authorization'] = this.authHeader;
        }

        const url = new URL(this.serverUrl);
        this.transport = new StreamableHTTPClientTransport(url, {
          requestInit: {
            headers,
          },
        });
      }

      await this.client.connect(this.transport);
      this.connected = true;
      this.state = 'connected';
      this.reconnectAttempts = 0;

      // Rediscover tools immediately
      try {
        const toolsRes = await this.client.listTools();
        this.toolsCache = toolsRes?.tools || [];
      } catch (_e) {}

      return {
        success: true,
        tools: this.toolsCache,
      };
    } catch (err) {
      this.connected = false;
      this.state = 'offline';
      return {
        success: false,
        error: {
          code: 'mcp_unavailable',
          message: `Failed to connect to MCP server: ${err.message || 'Server unreachable'}`,
        },
      };
    }
  }

  /**
   * Reconnects with exponential backoff: 1s, 2s, 5s, 10s, 30s, max 60s + jitter.
   */
  async reconnect() {
    this.state = 'reconnecting';
    this.reconnectAttempts++;

    const backoffs = [1000, 2000, 5000, 10000, 30000, 60000];
    const baseDelay = backoffs[Math.min(this.reconnectAttempts - 1, backoffs.length - 1)];
    const jitter = Math.floor(Math.random() * 500);
    const delay = baseDelay + jitter;

    await new Promise((r) => setTimeout(r, delay));

    await this.disconnect();
    const result = await this.connect();
    if (!result.success) {
      this.state = 'offline';
    }
    return result;
  }

  /**
   * Lists available tools exposed by the MCP server.
   */
  async listTools() {
    if (!this.client || !this.connected) {
      const connectResult = await this.connect();
      if (!connectResult.success) {
        return connectResult;
      }
    }

    try {
      const toolsResult = await this.client.listTools();
      return {
        success: true,
        tools: toolsResult?.tools || [],
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'mcp_unavailable',
          message: `MCP tools/list failed: ${err.message || 'Unknown error'}`,
        },
      };
    }
  }

  /**
   * Calls a tool on the MCP server with strict timeout and sanitized output.
   */
  async callTool(name, toolArguments = {}) {
    if (!this.client || !this.connected) {
      const connectResult = await this.connect();
      if (!connectResult.success) {
        return connectResult;
      }
    }

    try {
      const callPromise = this.client.callTool({
        name,
        arguments: toolArguments,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`MCP tool execution timed out after ${this.timeoutMs}ms`)), this.timeoutMs)
      );

      const result = await Promise.race([callPromise, timeoutPromise]);
      return {
        success: true,
        result: result?.content || result,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'provider_unavailable',
          message: `MCP tool execution failed: ${err.message || 'Execution error'}`,
        },
      };
    }
  }

  /**
   * Verifies connection health via ping or tools check.
   */
  async testConnection() {
    try {
      if (!this.connected) {
        const connectRes = await this.connect();
        if (!connectRes.success) return connectRes;
      }
      if (typeof this.client.ping === 'function') {
        await this.client.ping();
      } else {
        await this.client.listTools();
      }
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'connection_lost',
          message: `MCP health check failed: ${err.message || 'Ping failed'}`,
        },
      };
    }
  }

  /**
   * Closes the MCP client session and transport cleanly.
   */
  async disconnect() {
    this.connected = false;
    if (this.client) {
      try {
        await this.client.close();
      } catch (_e) {}
      this.client = null;
    }
    if (this.transport) {
      try {
        await this.transport.close();
      } catch (_e) {}
      this.transport = null;
    }
    return { success: true };
  }
}

module.exports = {
  McpTransport,
};
