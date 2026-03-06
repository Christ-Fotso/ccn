'use client';

import { useState, useEffect } from 'react';

interface Convention {
  idcc: string;
  name: string;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [conventions, setConventions] = useState<Convention[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for initial UI dev
  useEffect(() => {
    setConventions([
      { idcc: '0044', name: 'Boulangerie-pâtisserie (entreprises artisanales)' },
      { idcc: '1486', name: 'Bureaux d’études techniques (Syntec)' },
      { idcc: '3248', name: 'Métallurgie (Convention unifiée)' },
    ]);
  }, []);

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
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">Recherchez parmi les 458 conventions collectives nationales mises à jour via data.gouv.fr</p>
          
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-600 text-slate-400">
              <svg className="h-6 w-6 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-5 text-lg border-2 border-slate-200 rounded-2xl bg-white shadow-xl shadow-slate-200/50 focus:ring-0 focus:border-blue-600 transition-all outline-none"
              placeholder="Nom de la branche ou Code IDCC..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 p-2">
              <button className="bg-blue-600 text-white px-6 h-full rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md">
                Rechercher
              </button>
            </div>
          </div>
        </section>

        {/* Results / List */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">Conventions populaires</h3>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Trier par IDCC</button>
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Récents</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {conventions.map((conv) => (
              <div key={conv.idcc} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <span className="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1 rounded-md border border-blue-100 uppercase tracking-widest">IDCC {conv.idcc}</span>
                  <div className="text-slate-300 group-hover:text-blue-400 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">{conv.name}</h4>
                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                  <span>Mise à jour : 05/03/2026</span>
                  <span className="text-emerald-500 flex items-center">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                    À jour
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
