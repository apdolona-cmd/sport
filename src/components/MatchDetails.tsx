import type { ProcessedMatch } from '../services/espnApi';
import { Clock, MapPin, Tv, Globe } from 'lucide-react';

interface MatchDetailsProps {
  match: ProcessedMatch;
  getArabicName: (name: string) => string;
}

export default function MatchDetails({ match, getArabicName }: MatchDetailsProps) {
  const matchDate = new Date(match.date);
  const dateStr = matchDate.toLocaleDateString('ar-EG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const timeStr = matchDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 border-b border-white/10 p-3">
        <h3 className="text-white font-bold text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
          📊 تفاصيل المباراة
        </h3>
      </div>

      <div className="p-3 space-y-3">
        {/* Teams */}
        <div className="flex items-center justify-between bg-white/3 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <img src={match.homeLogo} alt="" className="w-8 h-8" crossOrigin="anonymous" />
            <span className="text-white text-xs font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>{getArabicName(match.homeTeam)}</span>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1">
              <span className="text-xl font-black text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>{match.homeScore}</span>
              <span className="text-white/30">-</span>
              <span className="text-xl font-black text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>{match.awayScore}</span>
            </div>
            {match.status === 'live' && (
              <span className="text-red-400 text-[9px] font-bold animate-pulse">{match.clock}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white text-xs font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>{getArabicName(match.awayTeam)}</span>
            <img src={match.awayLogo} alt="" className="w-8 h-8" crossOrigin="anonymous" />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <Clock className="w-3.5 h-3.5 text-green-400" />
            <span style={{ fontFamily: 'Cairo, sans-serif' }}>{dateStr} - {timeStr}</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <Tv className="w-3.5 h-3.5 text-green-400" />
            <span style={{ fontFamily: 'Cairo, sans-serif' }}>beIN Sports {match.broadcasts ? `(${match.broadcasts})` : ''}</span>
          </div>
          {match.venue && (
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <MapPin className="w-3.5 h-3.5 text-green-400" />
              <span style={{ fontFamily: 'Cairo, sans-serif' }}>{match.venue}{match.city ? `, ${match.city}` : ''}</span>
            </div>
          )}
          {match.group && (
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <Globe className="w-3.5 h-3.5 text-green-400" />
              <span style={{ fontFamily: 'Cairo, sans-serif' }}>{match.group}</span>
            </div>
          )}
        </div>

        {/* Status */}
        <div className={`rounded-lg p-3 text-center ${
          match.status === 'live' ? 'bg-red-500/10 border border-red-500/30' :
          match.status === 'finished' ? 'bg-gray-500/10 border border-gray-500/30' :
          'bg-blue-500/10 border border-blue-500/30'
        }`}>
          <p className={`text-sm font-bold ${
            match.status === 'live' ? 'text-red-400' :
            match.status === 'finished' ? 'text-gray-400' :
            'text-blue-400'
          }`} style={{ fontFamily: 'Cairo, sans-serif' }}>
            {match.status === 'live' ? `🔴 مباشر الآن - ${match.clock}` :
             match.status === 'finished' ? '✅ انتهت المباراة' :
             `⏰ ${match.statusText}`}
          </p>
        </div>
      </div>
    </div>
  );
}
