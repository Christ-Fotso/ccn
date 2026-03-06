import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const mcpClient = {
  /**
   * Calls the data.gouv.fr MCP server via mcporter
   */
  async callDataGouv(toolName: string, args: Record<string, any> = {}) {
    const argsString = Object.entries(args)
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join(' ');
    
    try {
      const { stdout } = await execAsync(`mcporter call datagouv.${toolName} ${argsString} --json`);
      return JSON.parse(stdout);
    } catch (error) {
      console.error(`MCP Call Error (${toolName}):`, error);
      throw error;
    }
  },

  /**
   * Fetch the list of CCNs using the Tabular API resource identified during research
   */
  async getConventionsList(page = 1, pageSize = 20) {
    return this.callDataGouv('query_resource_data', {
      resource_id: '02b67492-5243-44e8-8dd1-0cb3f90f35ff', // KALI mapping resource
      question: 'Liste des conventions collectives',
      page,
      page_size: pageSize
    });
  }
};
