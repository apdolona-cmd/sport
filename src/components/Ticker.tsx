import type { ProcessedMatch } from '../services/espnApi';

interface TickerProps {
  matches: ProcessedMatch[];
  getArabicName: (name: string) => string;
}

export default function Ticker({ matches, getArabicName }: TickerProps) {
  if (matches.length === 0) return null;

  return (
    <div className="bg-[#0a0a2e] border-b border-white/5 overflow-hidden">
      <div className="flex items-center">
        <div className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1.5 flex items-center gap-1 shrink-0 z-10">
          <span className="w-1.5 h-1.5 bg-white rounded-full" />
          <span style={{ fontFamily: 'Cairo' }}>كأس العالم</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee whitespace-nowrap py-1.5 flex items-center gap-5">
            {[...matches, ...matches].map((match, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-xs text-white/70">
                <img src={match.homeLogo} alt="" className="w-3.5 h-3.5" crossOrigin="anonymous" />
                <span className="font-semibold text-white text-[11px]">{getArabicName(match.homeTeam)}</span>
                <span className="font-black text-green-400 text-[11px]" style={{ fontFamily: 'Orbitron', direction: 'ltr' }}>
                  {match.homeScore}-{match.awayScore}
                </span>
                <span className="font-semibold text-white text-[11px]">{getArabicName(match.awayTeam)}</span>
                <img src={match.awayLogo} alt="" className="w-3.5 h-3.5" crossOrigin="anonymous" />
                {match.status === 'live' && <span className="text-red-400 text-[9px] font-bold">({match.clock})</span>}
                {match.status === 'finished' && <span className="text-gray-500 text-[9px]">(انتهت)</span>}
                <span className="text-white/10 mx-1">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
