import { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Ticker from './components/Ticker';
import FeaturedMatch from './components/FeaturedMatch';
import MatchCard from './components/MatchCard';
import MatchDetails from './components/MatchDetails';
import StatsBar from './components/StatsBar';

import GroupStandings from './components/GroupStandings';
import SplashScreen from './components/SplashScreen';
import GoalNotification from './components/GoalNotification';
import FeaturesPanel from './components/FeaturesPanel';
import TeamsModal from './components/TeamsModal';
import { fetchTodayMatches, fetchMatchesByDate, type ProcessedMatch } from './services/espnApi';
import { Settings, Heart, HeartOff } from 'lucide-react';

// Arabic team names mapping
const teamNameAr: Record<string, string> = {
  'Mexico': 'المكسيك', 'South Africa': 'جنوب أفريقيا', 'South Korea': 'كوريا الجنوبية',
  'Czech Republic': 'التشيك', 'Czechia': 'التشيك', 'United States': 'أمريكا', 'USA': 'أمريكا',
  'Australia': 'أستراليا', 'Canada': 'كندا', 'Qatar': 'قطر', 'Switzerland': 'سويسرا',
  'Brazil': 'البرازيل', 'Haiti': 'هايتي', 'Morocco': 'المغرب', 'Scotland': 'اسكتلندا',
  'Turkey': 'تركيا', 'Paraguay': 'باراغواي', 'Netherlands': 'هولندا', 'Sweden': 'السويد',
  'Germany': 'ألمانيا', 'Ivory Coast': "ساحل العاج", "Côte d'Ivoire": "ساحل العاج",
  'Japan': 'اليابان', 'Tunisia': 'تونس', 'Spain': 'إسبانيا', 'Saudi Arabia': 'السعودية',
  'Belgium': 'بلجيكا', 'Iran': 'إيران', 'Egypt': 'مصر', 'New Zealand': 'نيوزيلندا',
  'Uruguay': 'أوروغواي', 'Cape Verde': 'الرأس الأخضر', 'Cabo Verde': 'الرأس الأخضر',
  'Argentina': 'الأرجنتين', 'Austria': 'النمسا', 'France': 'فرنسا', 'Iraq': 'العراق',
  'Norway': 'النرويج', 'Senegal': 'السنغال', 'Algeria': 'الجزائر', 'Jordan': 'الأردن',
  'Ecuador': 'الإكوادور', 'Curaçao': 'كوراساو', 'Curacao': 'كوراساو',
  'England': 'إنجلترا', 'Croatia': 'كرواتيا', 'Ghana': 'غانا', 'Panama': 'بنما',
  'Colombia': 'كولومبيا', 'Uzbekistan': 'أوزبكستان', 'Portugal': 'البرتغال',
  'DR Congo': 'الكونغو', 'Nigeria': 'نيجيريا', 'Cameroon': 'الكاميرون',
  'Bosnia-Herzegovina': 'البوسنة', 'Bosnia and Herzegovina': 'البوسنة',
  'Serbia': 'صربيا', 'Denmark': 'الدنمارك', 'Italy': 'إيطاليا', 'Poland': 'بولندا',
  'Chile': 'تشيلي', 'Peru': 'بيرو', 'Costa Rica': 'كوستاريكا',
  'Wales': 'ويلز', 'Ireland': 'أيرلندا', 'Ukraine': 'أوكرانيا',
};

export default function App() {
  // Splash screen
  const [showSplash, setShowSplash] = useState(true);
  
  // Data states
  const [matches, setMatches] = useState<ProcessedMatch[]>([]);
  const [yesterdayMatches, setYesterdayMatches] = useState<ProcessedMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<ProcessedMatch | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  
  // Features states
  const [showFeaturesPanel, setShowFeaturesPanel] = useState(false);
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    darkMode: true,
    arabicNames: true,
  });
  
  // Goal notification
  const [goalNotification, setGoalNotification] = useState<{
    team: string;
    teamLogo: string;
    score: string;
  } | null>(null);
  
  // Previous scores for goal detection
  const prevScoresRef = useRef<Record<string, string>>({});

  const getArabicName = (name: string): string => {
    return settings.arabicNames ? (teamNameAr[name] || name) : name;
  };

  const loadMatches = useCallback(async () => {
    try {
      setError(null);
      const todayData = await fetchTodayMatches();
      
      // Fetch yesterday, tomorrow, and day after for full coverage
      const fmt = (d: Date) => d.toISOString().split('T')[0].replace(/-/g, '');
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date(); dayAfter.setDate(dayAfter.getDate() + 2);

      const [yestData, tomorrowData, dayAfterData] = await Promise.all([
        fetchMatchesByDate(fmt(yesterday)),
        fetchMatchesByDate(fmt(tomorrow)),
        fetchMatchesByDate(fmt(dayAfter)),
      ]);
      
      const allFetched = [...todayData, ...yestData, ...tomorrowData, ...dayAfterData];
      if (allFetched.length > 0) {
        // Check for goals
        if (settings.notifications) {
          for (const match of todayData) {
            if (match.status === 'live') {
              const prevScore = prevScoresRef.current[match.id];
              const currentScore = `${match.homeScore}-${match.awayScore}`;
              
              if (prevScore && prevScore !== currentScore) {
                // Goal scored!
                const prevHome = parseInt(prevScore.split('-')[0]);
                const currHome = parseInt(match.homeScore);
                
                const scoringTeam = currHome > prevHome ? match.homeTeam : match.awayTeam;
                const scoringLogo = currHome > prevHome ? match.homeLogo : match.awayLogo;
                
                setGoalNotification({
                  team: getArabicName(scoringTeam),
                  teamLogo: scoringLogo,
                  score: currentScore,
                });

                // Play sound
                if (settings.sound) {
                  const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQoALIfA6NWSAhAkfb/y64gGBxJ2yfbjkQoFFnXS+OaVCgQTdNb955YJAxN01/vnlgkDE3TX++eWCQMTdNf755YJBRN01/vnlgkFE3TX++eWCQUTdNf755YJAw==');
                  audio.volume = 0.3;
                  audio.play().catch(() => {});
                }
              }
              
              prevScoresRef.current[match.id] = currentScore;
            }
          }
        }
        
        setMatches(todayData);
        setYesterdayMatches([...yestData, ...tomorrowData, ...dayAfterData]);
        setLastUpdate(new Date());
        
        const all = [...todayData, ...yestData, ...tomorrowData, ...dayAfterData];
        // Remove duplicates
        const uniqueAll = all.filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i);
        
        const egyptLive = uniqueAll.find(m => m.status === 'live' && (m.homeTeam.includes('Egypt') || m.awayTeam.includes('Egypt')));
        const anyLive = uniqueAll.find(m => m.status === 'live');
        const egyptMatch = uniqueAll.find(m => m.homeTeam.includes('Egypt') || m.awayTeam.includes('Egypt'));
        const anyUpcoming = uniqueAll.find(m => m.status === 'upcoming');
        const anyFinished = uniqueAll.find(m => m.status === 'finished');
        
        if (!selectedMatch || selectedMatch.status !== 'live') {
          setSelectedMatch(egyptLive || anyLive || egyptMatch || anyUpcoming || anyFinished || uniqueAll[0] || null);
        } else {
          const updated = uniqueAll.find(m => m.id === selectedMatch.id);
          if (updated) setSelectedMatch(updated);
        }
      }
    } catch (err) {
      setError('خطأ في تحميل البيانات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedMatch, settings.notifications, settings.sound, settings.arabicNames]);

  useEffect(() => {
    if (!showSplash) {
      loadMatches();
    }
  }, [showSplash]);

  useEffect(() => {
    if (!showSplash) {
      const interval = setInterval(loadMatches, 30000);
      return () => clearInterval(interval);
    }
  }, [loadMatches, showSplash]);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (matchId: string) => {
    setFavorites(prev => 
      prev.includes(matchId) 
        ? prev.filter(id => id !== matchId)
        : [...prev, matchId]
    );
  };

  const handleSettingsChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const allMatches = [...matches, ...yesterdayMatches.filter(ym => 
    !matches.some(m => m.id === ym.id)
  )];

  const filteredMatches = activeFilter === 'all' 
    ? allMatches 
    : activeFilter === 'favorites'
    ? allMatches.filter(m => favorites.includes(m.id))
    : allMatches.filter(m => m.status === activeFilter);

  const liveCount = allMatches.filter(m => m.status === 'live').length;
  const upcomingCount = allMatches.filter(m => m.status === 'upcoming').length;

  // Show splash screen
  if (showSplash) {
    return <SplashScreen onEnter={() => setShowSplash(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050510]" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
            ⚽ العرباوية ماتش
          </p>
          <p className="text-white/50 text-sm mt-2" style={{ fontFamily: 'Cairo, sans-serif' }}>جاري تحميل المباريات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10" dir="rtl">
      {/* Goal Notification */}
      {goalNotification && (
        <GoalNotification
          {...goalNotification}
          onClose={() => setGoalNotification(null)}
        />
      )}

      {/* Teams Modal */}
      <TeamsModal
        isOpen={showTeamsModal}
        onClose={() => setShowTeamsModal(false)}
        getArabicName={getArabicName}
      />

      {/* Features Panel */}
      <FeaturesPanel
        isOpen={showFeaturesPanel}
        onClose={() => setShowFeaturesPanel(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />

      <Header />
      
      <Ticker matches={allMatches.filter(m => m.status === 'live' || m.status === 'finished').length > 0
        ? allMatches.filter(m => m.status === 'live' || m.status === 'finished')
        : allMatches.slice(0, 6)
      } getArabicName={getArabicName} />

      {/* Auto-update indicator */}
      <div className="bg-[#0a0a2e] border-b border-white/5 py-1.5">
        <div className="container mx-auto px-4 flex items-center justify-between text-[10px] text-white/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span style={{ fontFamily: 'Cairo, sans-serif' }}>تحديث تلقائي كل 30 ثانية</span>
          </div>
          <div className="flex items-center gap-3">
            <span>آخر تحديث: {lastUpdate.toLocaleTimeString('ar-EG')}</span>
            <button 
              onClick={() => setShowFeaturesPanel(true)}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-full cursor-pointer transition-colors"
            >
              <Settings className="w-3 h-3" />
              <span>الإعدادات</span>
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-5 space-y-5">
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 text-red-400 text-sm text-center" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {error} - <button onClick={loadMatches} className="underline cursor-pointer">إعادة المحاولة</button>
          </div>
        )}

        <StatsBar
          liveCount={liveCount}
          totalCount={allMatches.length}
          upcomingCount={upcomingCount}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onShowTeams={() => setShowTeamsModal(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Match List */}
          <div className="lg:col-span-3 order-2 lg:order-1 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-sm font-bold flex items-center gap-1.5" style={{ fontFamily: 'Cairo, sans-serif' }}>
                📅 مباريات كأس العالم
              </h2>
              <button onClick={loadMatches} className="text-green-400 text-[10px] bg-green-500/10 px-2 py-0.5 rounded-full cursor-pointer hover:bg-green-500/20 transition-colors">
                🔄 تحديث
              </button>
            </div>

            {/* Enhanced Filter Tabs with Favorites */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { id: 'all', label: 'الكل', icon: '📋' },
                { id: 'live', label: 'مباشر', icon: '🔴' },
                { id: 'upcoming', label: 'قادمة', icon: '⏰' },
                { id: 'finished', label: 'انتهت', icon: '✅' },
                { id: 'favorites', label: 'المفضلة', icon: '⭐' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeFilter === filter.id
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                  }`}
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.label}</span>
                  {filter.id === 'favorites' && favorites.length > 0 && (
                    <span className="bg-yellow-500 text-black text-[9px] px-1.5 rounded-full">{favorites.length}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-[650px] overflow-y-auto custom-scrollbar pr-1">
              {filteredMatches.map((match) => (
                <div key={match.id} className="relative">
                  <MatchCard
                    match={match}
                    onSelect={setSelectedMatch}
                    isSelected={selectedMatch?.id === match.id}
                    getArabicName={getArabicName}
                  />
                  {/* Favorite button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(match.id); }}
                    className="absolute top-2 left-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors cursor-pointer z-10"
                  >
                    {favorites.includes(match.id) ? (
                      <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                    ) : (
                      <HeartOff className="w-3.5 h-3.5 text-white/30" />
                    )}
                  </button>
                </div>
              ))}
              {filteredMatches.length === 0 && (
                <div className="text-center py-8 text-white/40">
                  <p className="text-3xl mb-2">{activeFilter === 'favorites' ? '⭐' : '🔍'}</p>
                  <p className="text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {activeFilter === 'favorites' ? 'لم تضف مباريات للمفضلة بعد' : 'لا توجد مباريات'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Center - Featured Match */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-sm font-bold flex items-center gap-1.5" style={{ fontFamily: 'Cairo, sans-serif' }}>
                🎬 العرباوية ماتش
              </h2>
              <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span>بيانات ESPN الحية</span>
              </div>
            </div>

            {selectedMatch && (
              <FeaturedMatch match={selectedMatch} getArabicName={getArabicName} />
            )}

            {/* Quick Match Switcher */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {allMatches.filter(m => m.status === 'live' || m.status === 'upcoming').slice(0, 8).map((match) => (
                <button
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                    selectedMatch?.id === match.id
                      ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <img src={match.homeLogo} alt="" className="w-5 h-5" crossOrigin="anonymous" />
                  <span className="font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    {match.homeScore}-{match.awayScore}
                  </span>
                  <img src={match.awayLogo} alt="" className="w-5 h-5" crossOrigin="anonymous" />
                  {match.status === 'live' && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                </button>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 order-3 space-y-3">
            <h2 className="text-white text-sm font-bold flex items-center gap-1.5" style={{ fontFamily: 'Cairo, sans-serif' }}>
              📊 التفاصيل
            </h2>

            {selectedMatch && <MatchDetails match={selectedMatch} getArabicName={getArabicName} />}
            <GroupStandings />

            {/* beIN Channels */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-3">
              <h3 className="text-white font-bold text-xs mb-2 flex items-center gap-1.5" style={{ fontFamily: 'Cairo, sans-serif' }}>
                📺 القنوات الناقلة
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {['beIN Max 1', 'beIN Max 2', 'beIN Max 3', 'beIN Max 4', 'beIN المجانية', 'TOD TV'].map((channel) => (
                  <div key={channel} className="bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20 rounded-lg p-1.5 text-center">
                    <p className="text-white/80 text-[10px] font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>{channel}</p>
                  </div>
                ))}
              </div>
              <p className="text-white/30 text-[9px] mt-2 text-center" style={{ fontFamily: 'Cairo, sans-serif' }}>
                تردد beIN المجانية: 11054 أفقي - نايل سات
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-6 py-4">
        <div className="container mx-auto px-4 text-center text-white/20 text-[10px]" style={{ fontFamily: 'Cairo, sans-serif' }}>
          <p>⚽ العرباوية ماتش | كأس العالم 2026 🏆 | نتائج حقيقية لحظة بلحظة</p>
          <p className="mt-1">🇺🇸 أمريكا • 🇨🇦 كندا • 🇲🇽 المكسيك</p>
        </div>
      </footer>
    </div>
  );
}
