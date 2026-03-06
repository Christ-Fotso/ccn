'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface ConventionDetail {
  id: string;
  idcc: string;
  name: string;
  nature: string;
  etat: string;
  debut: string;
  url_legifrance: string;
  organization: string;
}

export default function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<ConventionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/conventions/${id}`);
        if (!res.ok) throw new Error('Impossible de charger les détails');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-blue-600 font-bold hover:text-blue-800 transition-all">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
             </svg>
             <span>Retour au catalogue</span>
          </Link>
          <h1 className="text-xl font-black uppercase italic tracking-tighter">A-CCN System</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 shadow-xl border-4 border-slate-100 animate-pulse space-y-8">
             <div className="h-4 bg-slate-100 rounded w-1/4"></div>
             <div className="h-12 bg-slate-100 rounded w-full"></div>
             <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-slate-50 rounded-2xl"></div>
                <div className="h-20 bg-slate-50 rounded-2xl"></div>
             </div>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border-4 border-rose-200 p-12 rounded-3xl text-center">
             <h2 className="text-2xl font-black text-rose-800 uppercase mb-4 tracking-tighter">Erreur d'accès</h2>
             <p className="text-rose-600 font-bold uppercase text-sm">{error}</p>
             <Link href="/" className="mt-8 inline-block bg-rose-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-rose-700">Retourner à l'accueil</Link>
          </div>
        ) : data && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-slate-100">
               <div className="flex items-center space-x-3 mb-6">
                 <span className="bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-lg shadow-blue-200">IDCC {data.idcc}</span>
                 <span className="text-xs font-mono text-slate-300">REF: {data.id}</span>
               </div>
               <h2 className="text-3xl font-black text-slate-900 leading-tight uppercase tracking-tight mb-8">{data.name}</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nature du texte</p>
                     <p className="font-bold text-slate-700">{data.nature}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">État de vigueur</p>
                     <p className="font-bold text-emerald-600">{data.etat}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date d'entrée en vigueur</p>
                     <p className="font-bold text-slate-700">{data.debut}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Organisme Source</p>
                     <p className="font-bold text-slate-700">{data.organization}</p>
                  </div>
               </div>

               <div className="mt-10 pt-10 border-t-4 border-slate-50 flex flex-col sm:flex-row gap-4">
                  <a 
                    href={data.url_legifrance} 
                    target="_blank" 
                    className="flex-1 bg-blue-600 text-white text-center py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-100"
                  >
                    Voir sur Légifrance
                  </a>
                  <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-200">
                    Générer la Synthèse
                  </button>
               </div>
            </div>

            <div className="bg-blue-50 border-4 border-blue-100 rounded-3xl p-10 text-center italic text-blue-800 font-medium">
              <p className="mb-4">"Le texte intégral de cette convention est actuellement en cours de traitement par nos systèmes d'extraction."</p>
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
