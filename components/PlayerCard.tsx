import React from 'react';
import { Player } from '../types';

interface PlayerCardProps {
  player: Player;
  onRemove: (id: string) => void;
}

const roleColors: Record<string, string> = {
  P: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  D: 'bg-green-100 text-green-800 border-green-200',
  C: 'bg-blue-100 text-blue-800 border-blue-200',
  A: 'bg-red-100 text-red-800 border-red-200',
};

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onRemove }) => {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${roleColors[player.role]} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-3">
        <span className="font-bold w-6 h-6 flex items-center justify-center rounded-full bg-white bg-opacity-50 text-xs">
          {player.role}
        </span>
        <span className="font-medium text-gray-900">{player.name}</span>
      </div>
      <button
        onClick={() => onRemove(player.id)}
        className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-white hover:bg-opacity-50 transition-colors"
        aria-label="Remove player"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};
