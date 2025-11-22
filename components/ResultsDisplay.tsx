import React from 'react';
import ReactMarkdown from 'react-markdown';
import { GroundingChunk } from '../types';

interface ResultsDisplayProps {
  title: string;
  content: string;
  sources?: GroundingChunk[];
  type: 'grades' | 'analysis';
  onClose: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ title, content, sources, type, onClose }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-fade-in">
      <div className={`px-6 py-4 flex justify-between items-center border-b ${type === 'grades' ? 'bg-pink-50 border-pink-100' : 'bg-indigo-50 border-indigo-100'}`}>
        <h2 className={`text-xl font-bold flex items-center gap-2 ${type === 'grades' ? 'text-pink-700' : 'text-indigo-700'}`}>
          {type === 'grades' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          )}
          {title}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

        {sources && sources.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Fonti & Riferimenti</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.web?.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-blue-600 truncate border border-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="truncate">{source.web?.title || source.web?.uri}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
