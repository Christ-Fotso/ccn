'use client';

import { useState, useEffect } from 'react';

interface Convention {
  idcc: string;
  name: string;
  id?: string;
  organization?: string;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [conventions, setConventions] = useState<Convention[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data from MCP
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/search');
      const data = await response.json();
      setConventions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Erreur lors de la recherche');
      
      const data = await response.json();
      setConventions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">A</div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">A-CCN <span className="text-blue-600">System</span></h1>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-semibold text-slate-500">
            <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Explorateur</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Historique</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Paramètres</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Accédez à l'intégrale des conventions</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">Données officielles interrogées en temps réel via le MCP data.gouv.fr</p>
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-600 text-slate-400">
              <svg className="h-6 w-6 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-5 text-lg border-2 border-slate-200 rounded-2xl bg-white shadow-xl shadow-slate-200/50 focus:ring-0 focus:border-blue-600 transition-all outline-none"
              placeholder="Ex: Boulangerie, Métallurgie, 3248..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 p-2">
              <button 
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 h-full rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connexion MCP...' : 'Rechercher'}
              </button>
            </div>
          </form>
          {error && <p className="mt-4 text-red-500 font-semibold">{error}</p>}
        </section>

        {/* Results / List */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">
              {loading ? 'Interrogation du serveur de l\'État...' : query ? `Résultats pour "${query}"` : 'Conventions Collectives Nationales'}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {!loading && conventions.map((conv) => (
              <div key={conv.id || conv.idcc} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <span className="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1 rounded-md border border-blue-100 uppercase tracking-widest text-ellipsis overflow-hidden max-w-[150px]">
                    IDCC {conv.idcc}
                  </span>
                  <div className="text-slate-300 group-hover:text-blue-400 transition-colors text-xs font-mono">
                    {conv.id}
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors line-clamp-3">{conv.name}</h4>
                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                  <span>Source : {conv.organization}</span>
                  <span className="text-emerald-500 flex items-center">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                    Officiel
                  </span>
                </div>
              </div>
            ))}
            {loading && [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse h-52 flex flex-col justify-between">
                <div className="flex justify-between"><div className="h-6 bg-slate-100 rounded w-20"></div><div className="h-6 bg-slate-100 rounded w-20"></div></div>
                <div className="h-12 bg-slate-100 rounded w-full"></div>
                <div className="h-6 bg-slate-100 rounded w-full"></div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
