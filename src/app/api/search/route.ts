import { NextRequest, NextResponse } from 'next/server';
import { mcpClient } from '@/lib/mcp-client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  try {
    const kaliResourceId = '02b67492-5243-44e8-8dd1-0cb3f90f35ff';
    const rows: any[] = [];
    
    const results = await mcpClient.callDataGouv('query_resource_data', { 
      resource_id: kaliResourceId,
      question: 'Liste les 100 premières lignes',
      page_size: 100
    });

    const text = results.structuredContent?.result || results.content?.[0]?.text || '';
    const rowBlocks = text.split(/Row \d+:/g);
    
    for (const block of rowBlocks) {
      // Find the IDCC (usually Unnamed: 3)
      const idccMatch = block.match(/Unnamed: 3:\s+(\d+)/);
      // Find the Title (usually Unnamed: 4)
      const nameMatch = block.match(/Unnamed: 4:\s+([^\n]+)/);
      // Find the ID (usually Unnamed: 1)
      const idMatch = block.match(/Unnamed: 1:\s+(KALICONT\w+)/);

      if (nameMatch && idMatch) {
        const name = nameMatch[1].trim();
        const idcc = idccMatch ? idccMatch[1] : '----';
        const id = idMatch[1];

        // Search logic
        if (q) {
          const lq = q.toLowerCase();
          if (!name.toLowerCase().includes(lq) && !idcc.toLowerCase().includes(lq)) {
            continue;
          }
        }

        rows.push({
          idcc,
          name,
          id,
          organization: 'DILA / KALI'
        });
      }
    }

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json([]);
  }
}
