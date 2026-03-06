import { NextRequest, NextResponse } from 'next/server';
import { mcpClient } from '@/lib/mcp-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const kaliResourceId = '02b67492-5243-44e8-8dd1-0cb3f90f35ff';
    
    // We try to find the specific row for this ID in the KALI table
    const results = await mcpClient.callDataGouv('query_resource_data', { 
      resource_id: kaliResourceId,
      question: `Détails de la convention ${id}`,
      page_size: 1
    });

    const text = results.structuredContent?.result || results.content?.[0]?.text || '';
    const lines = text.split('\n').map((l: string) => l.trim()).filter(Boolean);
    const entry: any = {};
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        entry[key] = value;
      }
    }

    // Mapping KALI Columns
    const convention = {
      id: entry['Unnamed: 1'] || entry['ID'] || id,
      idcc: entry['Unnamed: 3'] || entry['IDCC'] || '----',
      name: entry['Unnamed: 4'] || entry['TITRE'] || 'Convention inconnue',
      nature: entry['Unnamed: 5'] || entry['NATURE'] || 'N/A',
      etat: entry['Unnamed: 6'] || entry['ETAT'] || 'N/A',
      debut: entry['Unnamed: 7'] || entry['DEBUT'] || 'N/A',
      url_legifrance: entry['Unnamed: 9'] || entry['URL'] || '#',
      organization: 'DILA / KALI'
    };

    return NextResponse.json(convention);
  } catch (error) {
    console.error('Detail API Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des détails sur le serveur MCP.' }, { status: 500 });
  }
}
