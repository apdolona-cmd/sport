import { MapPin, ExternalLink, Radio, Eye, Play } from 'lucide-react';
import type { ProcessedMatch } from '../services/espnApi';
import LiveBadge from './LiveBadge';

interface FeaturedMatchProps {
  match: ProcessedMatch;
  getArabicName: (name: string) => string;
}

// Safe link opener - avoids COOP errors completely
function safeOpen(url: string) {
  // Create a temporary anchor element with proper attributes
  const a = document.createElement('a');
  a.href = url;
  a.rel = 'noopener noreferrer';
  a.target = '_blank';
  // Some browsers need this approach to avoid COOP
  a.setAttribute('referrerpolicy', 'no-referrer');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Build links specific to THIS match
function getMatchLinks(match: ProcessedMatch, getAr: (n: string) => string) {
  const nameAr = `${getAr(match.homeTeam)} × ${getAr(match.awayTeam)}`;

  return [
    { 
      name: `🔴 بث مباشر: ${nameAr}`, 
      desc: 'يلا شوت - بث مباشر لهذه المباراة', 
      url: 'https://yalla-shoot.watch/', 
      icon: '📺', 
      color: 'from-red-500/25 to-red-600/10 border-red-500/50', 
      hot: true 
    },
    { 
      name: `كورة لايف: ${nameAr}`, 
      desc: 'بث مباشر بجودة HD', 
      url: 'https://www.ahlankora.com/', 
      icon: '⚽', 
      color: 'from-green-500/20 to-green-600/10 border-green-500/40', 
      hot: true 
    },
    { 
      name: `يلا كورة: ${nameAr}`, 
      desc: 'متابعة مباشرة لحظة بلحظة', 
      url: 'https://yallaakora.com/', 
      icon: '🎯', 
      color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30', 
      hot: false 
    },
    { 
      name: 'TOD TV - البث الرسمي', 
      desc: 'beIN Sports الناقل الحصري للمونديال', 
      url: 'https://www.tod.tv', 
      icon: '🏆', 
      color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30', 
      hot: false 
    },
    { 
      name: `Tubi: ملخص ${nameAr}`, 
      desc: 'ملخصات وإعادة مجانية بالكامل', 
      url: 'https://tubitv.com/hubs/fifa-world-cup-fox-hub', 
      icon: '🆓', 
      color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30', 
      hot: false 
    },
  ];
}

export default function FeaturedMatch({ match, getArabicName }: FeaturedMatchProps) {
  const isLive = match.status === 'live';
  const isEgypt = match.homeTeam.includes('Egypt') || match.awayTeam.includes('Egypt');
  const matchLinks = getMatchLinks(match, getArabicName);

  const getEventIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('penalty') && t.includes('goal')) return '🎯';
    if (t.includes('own goal')) return '🔴';
    if (t.includes('goal')) return '⚽';
    if (t.includes('second yellow') || t.includes('yellow second')) return '🟨🟥';
    if (t.includes('yellow')) return '🟨';
    if (t.includes('red')) return '🟥';
    if (t.includes('sub')) return '🔄';
    return '📋';
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-[#0d1b2a] border border-green-500/20">
      {/* Match Header */}
      <div className="relative bg-gradient-to-br from-green-900/90 via-green-800/70 to-green-900/90 p-5 md:p-8">
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 1000 500" preserveAspectRatio="none">
          <rect x="40" y="30" width="920" height="440" fill="none" stroke="white" strokeWidth="3"/>
          <line x1="500" y1="30" x2="500" y2="470" stroke="white" strokeWidth="3"/>
          <circle cx="500" cy="250" r="70" fill="none" stroke="white" strokeWidth="3"/>
        </svg>

        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap z-10">
          {isEgypt && <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">🇪🇬 مباراة مصر</span>}
          {isLive && <LiveBadge minute={match.clock} />}
          {match.status === 'upcoming' && <span className="bg-blue-500/40 text-blue-200 text-[10px] font-bold px-2.5 py-1 rounded-full">⏰ {match.statusText}</span>}
          {match.status === 'finished' && <span className="bg-white/20 text-white/80 text-[10px] font-bold px-2.5 py-1 rounded-full">✅ {match.statusText}</span>}
        </div>
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-black/50 backdrop-blur text-white text-[10px] px-2.5 py-1.5 rounded-full border border-white/20">📺 beIN Sports</span>
        </div>

        <div className="relative flex items-center justify-center gap-4 md:gap-14 pt-6 pb-2">
          <div className="flex flex-col items-center gap-2 flex-1">
            <img src={match.homeLogo} alt="" className="w-14 h-14 md:w-20 md:h-20 drop-shadow-2xl" crossOrigin="anonymous"/>
            <span className="text-white text-sm md:text-lg font-black text-center" style={{ fontFamily: 'Cairo' }}>{getArabicName(match.homeTeam)}</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            {isLive && <div className="bg-red-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full">🔴 {match.clock}</div>}
            <div className="bg-black/40 backdrop-blur rounded-2xl px-5 py-3 border border-white/20">
              <div className="flex items-center gap-3">
                <span className="text-4xl md:text-6xl font-black text-white" style={{ fontFamily: 'Orbitron' }}>{match.homeScore}</span>
                <span className="text-xl md:text-3xl text-green-400 font-bold">:</span>
                <span className="text-4xl md:text-6xl font-black text-white" style={{ fontFamily: 'Orbitron' }}>{match.awayScore}</span>
              </div>
            </div>
            <span className="text-green-300 text-[10px] font-bold">{match.group}</span>
            {match.venue && <div className="flex items-center gap-1 text-white/50 text-[9px]"><MapPin className="w-2.5 h-2.5"/><span>{match.venue}</span></div>}
          </div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <img src={match.awayLogo} alt="" className="w-14 h-14 md:w-20 md:h-20 drop-shadow-2xl" crossOrigin="anonymous"/>
            <span className="text-white text-sm md:text-lg font-black text-center" style={{ fontFamily: 'Cairo' }}>{getArabicName(match.awayTeam)}</span>
          </div>
        </div>
      </div>

      {/* 3 Sections */}
      <div className="divide-y divide-white/5">

        {/* Section 1: Watch THIS match - أهم شيء أولاً */}
        <div className="p-4">
          <h4 className="text-white font-bold text-xs mb-1 flex items-center gap-1.5" style={{ fontFamily: 'Cairo' }}>
            📺 شاهد: {getArabicName(match.homeTeam)} × {getArabicName(match.awayTeam)}
          </h4>
          <p className="text-white/30 text-[10px] mb-3" style={{ fontFamily: 'Cairo' }}>اضغط على أي رابط لمشاهدة هذه المباراة</p>

          <div className="space-y-2">
            {matchLinks.map(ch => (
              <button key={ch.name} onClick={() => safeOpen(ch.url)}
                className={`w-full flex items-center gap-3 bg-gradient-to-r ${ch.color} border rounded-xl p-3.5 transition-all hover:scale-[1.01] hover:shadow-lg group relative cursor-pointer text-right`}>
                {ch.hot && (
                  <span className="absolute -top-1.5 -left-1.5 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                    LIVE
                  </span>
                )}
                <span className="text-xl">{ch.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-xs truncate" style={{ fontFamily: 'Cairo' }}>{ch.name}</p>
                  <p className="text-white/40 text-[10px]">{ch.desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/60 shrink-0"/>
              </button>
            ))}
          </div>

          <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mt-3">
            <p className="text-yellow-400/90 text-[10px] text-center" style={{ fontFamily: 'Cairo' }}>
              📡 البث التلفزيوني: beIN Max 2 | تردد 12604 أفقي | نايل سات
            </p>
            <p className="text-yellow-400/60 text-[9px] text-center mt-1" style={{ fontFamily: 'Cairo' }}>
              beIN المجانية | تردد 12245 عمودي | نايل سات
            </p>
          </div>
        </div>

        {/* Section 2: Events */}
        <div className="p-4">
          <h4 className="text-white font-bold text-xs mb-3 flex items-center gap-1.5" style={{ fontFamily: 'Cairo' }}>⚽ أحداث المباراة
            {match.events.length > 0 && <span className="bg-green-500/20 text-green-400 text-[9px] px-1.5 rounded-full">{match.events.length}</span>}
          </h4>
          {match.events.length > 0 ? (
            <div className="space-y-1.5">
              {match.events.map((ev, i) => (
                <div key={i} className={`flex items-center gap-2.5 p-2 rounded-lg text-xs ${ev.teamId === match.homeId ? 'bg-green-500/5 border-r-2 border-green-500' : 'bg-blue-500/5 border-l-2 border-blue-500'}`}>
                  <span className="font-bold text-white/50 w-9 shrink-0 text-center" style={{ fontFamily: 'Orbitron' }}>{ev.clock}</span>
                  <span className="text-sm">{getEventIcon(ev.type)}</span>
                  <span className="text-white/90 font-bold" style={{ fontFamily: 'Cairo' }}>{ev.playerName || ev.type}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-xs text-center py-3" style={{ fontFamily: 'Cairo' }}>
              {match.status === 'upcoming' ? '⏰ المباراة لم تبدأ بعد - الأحداث تظهر لحظياً' : 'لا توجد أحداث مسجلة'}
            </p>
          )}
        </div>

        {/* Section 3: Stats */}
        {match.stats && (
          <div className="p-4">
            <h4 className="text-white font-bold text-xs mb-3" style={{ fontFamily: 'Cairo' }}>📊 الإحصائيات</h4>
            <div className="space-y-2.5">
              {[
                { label: 'الاستحواذ', home: match.stats.homePossession, away: match.stats.awayPossession, suffix: '%' },
                { label: 'التسديدات', home: match.stats.homeShots, away: match.stats.awayShots },
                { label: 'على المرمى', home: match.stats.homeShotsOnTarget, away: match.stats.awayShotsOnTarget },
                { label: 'الركنيات', home: match.stats.homeCorners, away: match.stats.awayCorners },
                { label: 'الأخطاء', home: match.stats.homeFouls, away: match.stats.awayFouls },
              ].map((s, i) => {
                const h = parseFloat(s.home) || 0, a = parseFloat(s.away) || 0, t = h + a || 1;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-white/80 font-bold">{s.home}{s.suffix || ''}</span>
                      <span className="text-white/50" style={{ fontFamily: 'Cairo' }}>{s.label}</span>
                      <span className="text-white/80 font-bold">{s.away}{s.suffix || ''}</span>
                    </div>
                    <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-white/5">
                      <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-full" style={{ width: `${(h/t)*100}%` }}/>
                      <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" style={{ width: `${(a/t)*100}%` }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="bg-black/20 p-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1"><Radio className="w-3 h-3 text-green-400"/>تحديث كل 30 ثانية</div>
          <div className="flex items-center gap-1"><Eye className="w-3 h-3"/>ESPN Live</div>
        </div>
        <button onClick={() => safeOpen('https://yalla-shoot.watch/')}
          className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded-full border border-red-500/30 transition-colors cursor-pointer font-bold">
          <Play className="w-3 h-3" fill="currentColor"/>شاهد الآن
        </button>
      </div>
    </div>
  );
}
