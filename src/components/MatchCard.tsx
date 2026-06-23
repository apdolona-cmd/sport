import { Play, Clock, CheckCircle } from 'lucide-react';
import type { ProcessedMatch } from '../services/espnApi';
import LiveBadge from './LiveBadge';

interface MatchCardProps {
  match: ProcessedMatch;
  onSelect: (match: ProcessedMatch) => void;
  isSelected: boolean;
  getArabicName: (name: string) => string;
}

export default function MatchCard({ match, onSelect, isSelected, getArabicName }: MatchCardProps) {
  const getStatusBadge = () => {
    switch (match.status) {
      case 'live':
        return <LiveBadge minute={match.clock} />;
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
            <Clock className="w-2.5 h-2.5" />
            {match.statusText}
          </span>
        );
      case 'finished':
        return (
          <span className="inline-flex items-center gap-1 bg-gray-500/20 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-500/30">
            <CheckCircle className="w-2.5 h-2.5" />
            انتهت
          </span>
        );
    }
  };

  return (
    <button
      onClick={() => onSelect(match)}
      className={`w-full text-right rounded-xl overflow-hidden transition-all duration-200 cursor-pointer group ${
        isSelected
          ? 'bg-gradient-to-r from-green-500/20 to-green-600/10 border-2 border-green-500/50 shadow-lg shadow-green-500/20'
          : 'bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 hover:border-green-500/30 hover:bg-white/[0.08]'
      }`}
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-semibold">
            <span>🏆</span>
            <span style={{ fontFamily: 'Cairo, sans-serif' }}>{match.group || 'كأس العالم'}</span>
          </div>
          {getStatusBadge()}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <img src={match.homeLogo} alt="" className="w-6 h-6" crossOrigin="anonymous" />
            <span className="text-white text-xs font-bold truncate" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {getArabicName(match.homeTeam)}
            </span>
          </div>

          <div className="flex items-center gap-2 px-2">
            {match.status === 'upcoming' ? (
              <span className="text-white/40 text-xs font-semibold">VS</span>
            ) : (
              <div className="flex items-center gap-1">
                <span className={`text-sm font-black ${match.status === 'live' ? 'text-white' : 'text-white/70'}`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  {match.homeScore}
                </span>
                <span className="text-white/30 text-xs">-</span>
                <span className={`text-sm font-black ${match.status === 'live' ? 'text-white' : 'text-white/70'}`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  {match.awayScore}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-white text-xs font-bold truncate" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {getArabicName(match.awayTeam)}
            </span>
            <img src={match.awayLogo} alt="" className="w-6 h-6" crossOrigin="anonymous" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
          <span className="text-[10px] text-white/40">📺 beIN Sports</span>
          {match.status === 'live' && (
            <span className="inline-flex items-center gap-1 text-green-400 text-[10px] font-bold">
              <Play className="w-2.5 h-2.5" fill="currentColor" />
              شاهد الآن
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
