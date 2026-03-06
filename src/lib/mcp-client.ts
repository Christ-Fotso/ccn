export const mcpClient = {
  /**
   * Calls the data.gouv.fr MCP server via direct HTTP JSON-RPC
   * Handles SSE format and potential multi-line data
   */
  async callDataGouv(toolName: string, args: Record<string, any> = {}) {
    const url = 'https://mcp.data.gouv.fr/mcp';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: toolName,
            arguments: args
          },
          id: Date.now()
        })
      });

      const rawText = await response.text();
      
      // Parse SSE format robustly
      // SSE can have multiple "data: " lines. We want the one containing the JSON-RPC response.
      const lines = rawText.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const dataContent = line.substring(6).trim();
            const parsed = JSON.parse(dataContent);
            if (parsed.result) return parsed.result;
            if (parsed.error) throw new Error(parsed.error.message || 'MCP Remote Error');
          } catch (e) {
            // Not JSON or incomplete, continue
            continue;
          }
        }
      }

      throw new Error('No valid JSON-RPC result found in MCP response');
    } catch (error) {
      console.error(`MCP Fetch Error (${toolName}):`, error);
      throw error;
    }
  }
};
