import React, { useState } from 'react';
import { Player, AppStatus, GradeResponse, AnalysisResponse } from './types';
import { PlayerCard } from './components/PlayerCard';
import { ResultsDisplay } from './components/ResultsDisplay';
import * as geminiService from './services/gemini';

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'P' | 'D' | 'C' | 'A'>('A');
  
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [gradeResults, setGradeResults] = useState<GradeResponse | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      role: newRole
    };
    
    setPlayers([...players, newPlayer]);
    setNewName('');
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleFetchGrades = async () => {
    if (players.length === 0) {
      setErrorMsg("Aggiungi almeno un giocatore prima di cercare.");
      return;
    }
    setStatus(AppStatus.LOADING_GRADES);
    setErrorMsg(null);
    setGradeResults(null);
    setAnalysisResults(null); // Clear other results to focus on this one
    
    try {
      const results = await geminiService.fetchLatestGrades(players);
      setGradeResults(results);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      setErrorMsg("Errore nel recupero dei voti. Riprova più tardi.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleAnalyzeTeam = async () => {
    if (players.length === 0) {
      setErrorMsg("Aggiungi almeno un giocatore prima di analizzare.");
      return;
    }
    setStatus(AppStatus.LOADING_ANALYSIS);
    setErrorMsg(null);
    setAnalysisResults(null);
    setGradeResults(null); // Clear other results
    
    try {
      const results = await geminiService.analyzeTeamStrategy(players);
      setAnalysisResults(results);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      setErrorMsg("Errore durante l'analisi strategica.");
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-inner">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">FantaGazzetta Assistant</h1>
              <p className="text-pink-100 text-sm font-medium">Powered by Gemini 2.5 Flash & 3.0 Pro Thinking</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Team Management */}
        <div className="lg:col-span-1 space-y-6">
          {/* Add Player Form */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Aggiungi Giocatore
            </h2>
            <form onSubmit={addPlayer} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nome</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Es. Dybala, Theo Hernandez..." 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Ruolo</label>
                <div className="flex gap-2">
                  {(['P', 'D', 'C', 'A'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setNewRole(r)}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${newRole === r 
                        ? 'bg-gray-800 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                type="submit" 
                disabled={!newName.trim()}
                className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white rounded-lg font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                Aggiungi alla Rosa
              </button>
            </form>
          </div>

          {/* Roster List */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 max-h-[500px] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">La Tua Rosa</h2>
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {players.length} Giocatori
              </span>
            </div>
            
            {players.length === 0 ? (
              <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                <p className="text-sm">La rosa è vuota.</p>
                <p className="text-xs mt-1">Aggiungi i tuoi giocatori sopra.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {players.map(p => (
                  <PlayerCard key={p.id} player={p} onRemove={removePlayer} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions & Results */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Button: Check Grades (Flash + Search) */}
            <button
              onClick={handleFetchGrades}
              disabled={status === AppStatus.LOADING_GRADES || status === AppStatus.LOADING_ANALYSIS || players.length === 0}
              className="relative group overflow-hidden bg-white p-6 rounded-xl shadow-sm border border-pink-100 hover:border-pink-300 transition-all text-left"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                Controlla Voti
              </h3>
              <p className="text-sm text-gray-500 mt-2 mb-4">
                Cerca i voti ufficiali Gazzetta dell'ultima giornata con Gemini Search.
              </p>
              <span className="inline-flex items-center text-xs font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded">
                Gemini 2.5 Flash + Search
              </span>
              {status === AppStatus.LOADING_GRADES && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                </div>
              )}
            </button>

            {/* Button: Coach Analysis (Pro + Thinking) */}
            <button
              onClick={handleAnalyzeTeam}
              disabled={status === AppStatus.LOADING_GRADES || status === AppStatus.LOADING_ANALYSIS || players.length === 0}
              className="relative group overflow-hidden bg-white p-6 rounded-xl shadow-sm border border-indigo-100 hover:border-indigo-300 transition-all text-left"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                Analisi Coach AI
              </h3>
              <p className="text-sm text-gray-500 mt-2 mb-4">
                Analisi profonda della rosa e consigli strategici con il thinking model.
              </p>
              <span className="inline-flex items-center text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                Gemini 3.0 Pro + Thinking
              </span>
              {status === AppStatus.LOADING_ANALYSIS && (
                 <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                  <p className="text-xs text-indigo-600 font-medium animate-pulse">Coach AI is thinking...</p>
                </div>
              )}
            </button>
          </div>

          {/* Loading/Error States */}
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errorMsg}
            </div>
          )}

          {/* Results Area */}
          {gradeResults && (
            <ResultsDisplay 
              title="Voti Ultima Giornata (Gazzetta)" 
              content={gradeResults.text}
              sources={gradeResults.sources}
              type="grades"
              onClose={() => setGradeResults(null)}
            />
          )}

          {analysisResults && (
            <ResultsDisplay 
              title="Analisi Strategica & Consigli" 
              content={analysisResults.text}
              type="analysis"
              onClose={() => setAnalysisResults(null)}
            />
          )}

          {/* Empty State Placeholder when nothing is loaded */}
          {!gradeResults && !analysisResults && !status.toString().includes('LOADING') && !errorMsg && (
             <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
                <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-gray-500 font-medium">Nessun risultato visualizzato</h3>
                <p className="text-gray-400 text-sm mt-1">Usa i pulsanti sopra per controllare i voti o analizzare la tua squadra.</p>
             </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
