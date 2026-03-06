'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Convention {
  idcc: string;
  name: string;
  id?: string;
  organization?: string;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [conventions, setConventions] = useState<Convention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/search');
      const data = await response.json();
      if (Array.isArray(data)) {
        setConventions(data);
      } else {
        setConventions([]);
      }
    } catch (err) {
      console.error('Initial Fetch Error:', err);
      setError("Impossible de charger les données initiales.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      fetchInitialData();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Erreur réseau lors de la recherche');
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setConventions(data);
      } else {
        throw new Error('Format de données invalide reçu du serveur');
      }
    } catch (err: any) {
      console.error('Search Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 uppercase italic">A</div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800 uppercase italic">A-CCN <span className="text-blue-600">System</span></h1>
          </div>
          <nav className="flex space-x-6 text-sm font-bold text-slate-500 uppercase tracking-tighter">
            <a href="#" className="text-blue-600 underline decoration-2 underline-offset-8">Explorateur</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Historique</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Search Section */}
        <section className="text-center mb-16">
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Données Officielles de l'État</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium">Recherche en temps réel via le protocole MCP sur les serveurs data.gouv.fr</p>
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
            <input
              type="text"
              className="block w-full px-6 py-6 text-xl border-4 border-slate-200 rounded-3xl bg-white shadow-2xl focus:border-blue-600 transition-all outline-none font-bold placeholder:text-slate-300"
              placeholder="Ex: Boulangerie, Syntec, Métallurgie, 3248..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-4 top-4 bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? '...' : 'Chercher'}
            </button>
          </form>
          {error && <div className="mt-8 p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl text-rose-700 font-bold uppercase text-xs tracking-widest">{error}</div>}
        </section>

        {/* Results / List */}
        <section>
          <div className="flex items-center justify-between mb-10 border-b-4 border-slate-100 pb-4">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
              {loading ? 'Interrogation en cours...' : query ? `Résultats pour "${query}"` : 'Catalogue National'}
            </h3>
            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">{conventions.length} RÉSULTATS TROUVÉS</span>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {!loading && conventions.map((conv, idx) => (
              <Link 
                key={`${conv.id}-${idx}`} 
                href={`/conventions/${conv.id}`}
                className="bg-white rounded-3xl p-8 border-4 border-transparent shadow-xl hover:border-blue-500 transition-all cursor-pointer group flex flex-col justify-between transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-[0.2em]">IDCC {conv.idcc}</span>
                    <span className="text-[10px] font-mono text-slate-300 group-hover:text-blue-200">{conv.id?.substring(0, 10)}</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-3">{conv.name}</h4>
                </div>
                <div className="mt-8 pt-6 border-t-2 border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Source : {conv.organization}</span>
                  <span className="text-blue-600 font-black underline underline-offset-4 decoration-2 text-right">Consulter →</span>
                </div>
              </Link>
            ))}

            
            {loading && [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border-4 border-slate-100 shadow-sm animate-pulse h-64 flex flex-col justify-between">
                <div className="h-4 bg-slate-100 rounded-full w-1/3"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-slate-100 rounded-full w-full"></div>
                  <div className="h-6 bg-slate-100 rounded-full w-4/5"></div>
                </div>
                <div className="h-4 bg-slate-100 rounded-full w-full"></div>
              </div>
            ))}
          </div>
          
          {!loading && conventions.length === 0 && !error && (
            <div className="text-center py-20 bg-white rounded-3xl border-4 border-dashed border-slate-200">
               <p className="text-slate-400 font-black uppercase tracking-[0.3em]">Aucune donnée trouvée sur le serveur</p>
               <button onClick={fetchInitialData} className="mt-6 text-blue-600 font-bold text-sm uppercase tracking-widest hover:underline underline-offset-8 decoration-2">Réinitialiser la recherche</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
