import type { ProcessedMatch } from '../services/espnApi';

interface TickerProps {
  matches: ProcessedMatch[];
  getArabicName: (name: string) => string;
}

export default function Ticker({ matches, getArabicName }: TickerProps) {
  if (matches.length === 0) return null;
  const doubled = [...matches, ...matches];

  return (
    <div className="bg-gradient-to-r from-[#0a0a2e] to-[#0d1b2a] border-b border-white/5 overflow-hidden">
      <div className="flex items-center">
        <div className="bg-red-600 text-white text-xs font-bold px-3 py-2 flex items-center gap-1.5 shrink-0 z-10">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span style={{ fontFamily: 'Cairo, sans-serif' }}>كأس العالم</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee whitespace-nowrap py-2 flex items-center gap-6">
            {doubled.map((match, index) => (
              <span key={index} className="inline-flex items-center gap-2 text-sm text-white/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                <img src={match.homeLogo} alt="" className="w-4 h-4" crossOrigin="anonymous" />
                <span className="font-semibold text-white">{getArabicName(match.homeTeam)}</span>
                <span className="font-black text-green-400" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  {match.homeScore} - {match.awayScore}
                </span>
                <span className="font-semibold text-white">{getArabicName(match.awayTeam)}</span>
                <img src={match.awayLogo} alt="" className="w-4 h-4" crossOrigin="anonymous" />
                {match.status === 'live' && (
                  <span className="text-red-400 text-xs font-bold">({match.clock})</span>
                )}
                {match.status === 'finished' && (
                  <span className="text-gray-400 text-xs">(انتهت)</span>
                )}
                <span className="text-white/20 mx-1">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
