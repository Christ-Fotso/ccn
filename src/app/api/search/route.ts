import { NextRequest, NextResponse } from 'next/server';
import { mcpClient } from '@/lib/mcp-client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  try {
    const resourceId = '02b67492-5243-44e8-8dd1-0cb3f90f35ff';
    
    // We query the Tabular API of the KALI list directly
    const results = await mcpClient.callDataGouv('query_resource_data', { 
      resource_id: resourceId,
      question: q ? `Rechercher ${q}` : 'Liste des conventions collectives',
      page_size: 50
    });

    if (!results || !results.rows) {
      return NextResponse.json([]);
    }

    // Map KALI columns to our interface
    // KALI format: Unnamed: 3 is IDCC, Unnamed: 4 is TITRE
    const formattedResults = results.rows
      .filter((row: any) => row['Unnamed: 4'] && row['Unnamed: 4'] !== 'TITRE') // Filter header/empty
      .map((row: any) => ({
        idcc: row['Unnamed: 3'] || 'N/A',
        name: row['Unnamed: 4'],
        id: row['Unnamed: 1'],
        organization: 'DILA / KALI'
      }));

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Failed to fetch from MCP' }, { status: 500 });
  }
}
