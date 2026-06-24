import type { ProcessedMatch } from '../services/espnApi';
import { Clock, MapPin, Tv, Globe } from 'lucide-react';

interface MatchDetailsProps {
  match: ProcessedMatch;
  getArabicName: (name: string) => string;
}

export default function MatchDetails({ match, getArabicName }: MatchDetailsProps) {
  const matchDate = new Date(match.date);
  const dateStr = matchDate.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = matchDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
      <div className="bg-green-500/5 border-b border-white/10 p-3">
        <h3 className="text-white font-bold text-xs" style={{ fontFamily: 'Cairo' }}>📊 تفاصيل المباراة</h3>
      </div>
      <div className="p-3 space-y-3">
        {/* Score */}
        <div className="flex items-center justify-between bg-white/[0.03] rounded-lg p-2.5">
          <div className="flex items-center gap-1.5">
            <img src={match.homeLogo} alt="" className="w-6 h-6" crossOrigin="anonymous" />
            <span className="text-white text-[11px] font-bold" style={{ fontFamily: 'Cairo' }}>{getArabicName(match.homeTeam)}</span>
          </div>
          <span className="text-lg font-black text-white" style={{ fontFamily: 'Orbitron', direction: 'ltr', display: 'inline-block' }}>
            {match.homeScore} - {match.awayScore}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-white text-[11px] font-bold" style={{ fontFamily: 'Cairo' }}>{getArabicName(match.awayTeam)}</span>
            <img src={match.awayLogo} alt="" className="w-6 h-6" crossOrigin="anonymous" />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1.5 text-[11px] text-white/50">
          <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-green-400 shrink-0" /><span>{dateStr} - {timeStr}</span></div>
          <div className="flex items-center gap-1.5"><Tv className="w-3 h-3 text-green-400 shrink-0" /><span>beIN Sports {match.broadcasts && `(${match.broadcasts})`}</span></div>
          {match.venue && <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-green-400 shrink-0" /><span>{match.venue}{match.city ? `, ${match.city}` : ''}</span></div>}
          {match.group && <div className="flex items-center gap-1.5"><Globe className="w-3 h-3 text-green-400 shrink-0" /><span>{match.group}</span></div>}
        </div>

        {/* Status */}
        <div className={`rounded-lg p-2.5 text-center text-xs font-bold ${
          match.status === 'live' ? 'bg-red-500/10 border border-red-500/30 text-red-400' :
          match.status === 'finished' ? 'bg-gray-500/10 border border-gray-500/30 text-gray-400' :
          'bg-blue-500/10 border border-blue-500/30 text-blue-400'
        }`} style={{ fontFamily: 'Cairo' }}>
          {match.status === 'live' ? `🔴 مباشر - ${match.clock}` :
           match.status === 'finished' ? '✅ انتهت المباراة' :
           `⏰ ${match.statusText}`}
        </div>
      </div>
    </div>
  );
}
