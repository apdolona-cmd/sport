import { useState, useEffect } from 'react';
import { fetchAllGroupStandings, type GroupStanding } from '../services/espnApi';
import { ChevronDown, ChevronUp, Trophy, RefreshCw } from 'lucide-react';

const teamNameAr: Record<string, string> = {
  'Mexico': 'المكسيك', 'South Africa': 'جنوب أفريقيا', 'South Korea': 'كوريا الجنوبية',
  'Czechia': 'التشيك', 'Czech Republic': 'التشيك', 'United States': 'أمريكا',
  'Australia': 'أستراليا', 'Canada': 'كندا', 'Qatar': 'قطر', 'Switzerland': 'سويسرا',
  'Brazil': 'البرازيل', 'Haiti': 'هايتي', 'Morocco': 'المغرب', 'Scotland': 'اسكتلندا',
  'Turkey': 'تركيا', 'Paraguay': 'باراغواي', 'Netherlands': 'هولندا', 'Sweden': 'السويد',
  'Germany': 'ألمانيا', 'Ivory Coast': 'ساحل العاج', "Côte d'Ivoire": 'ساحل العاج',
  'Japan': 'اليابان', 'Tunisia': 'تونس', 'Spain': 'إسبانيا', 'Saudi Arabia': 'السعودية',
  'Belgium': 'بلجيكا', 'Iran': 'إيران', 'Egypt': 'مصر', 'New Zealand': 'نيوزيلندا',
  'Uruguay': 'أوروغواي', 'Cape Verde': 'الرأس الأخضر', 'Cabo Verde': 'الرأس الأخضر',
  'Argentina': 'الأرجنتين', 'Austria': 'النمسا', 'France': 'فرنسا', 'Iraq': 'العراق',
  'Norway': 'النرويج', 'Senegal': 'السنغال', 'Algeria': 'الجزائر', 'Jordan': 'الأردن',
  'Ecuador': 'الإكوادور', 'Curaçao': 'كوراساو', 'Curacao': 'كوراساو',
  'England': 'إنجلترا', 'Croatia': 'كرواتيا', 'Ghana': 'غانا', 'Panama': 'بنما',
  'Colombia': 'كولومبيا', 'Uzbekistan': 'أوزبكستان', 'Portugal': 'البرتغال',
  'DR Congo': 'الكونغو', 'Congo DR': 'الكونغو', 'Nigeria': 'نيجيريا', 'Cameroon': 'الكاميرون',
  'Bosnia-Herzegovina': 'البوسنة', 'Bosnia and Herzegovina': 'البوسنة',
  'Serbia': 'صربيا', 'Denmark': 'الدنمارك', 'Italy': 'إيطاليا', 'Poland': 'بولندا',
  'Chile': 'تشيلي', 'Peru': 'بيرو', 'Costa Rica': 'كوستاريكا',
  'Wales': 'ويلز', 'Ireland': 'أيرلندا', 'Ukraine': 'أوكرانيا',
  'Indonesia': 'إندونيسيا', 'Jamaica': 'جامايكا', 'Trinidad and Tobago': 'ترينيداد',
  'Honduras': 'هندوراس', 'El Salvador': 'السلفادور', 'Bolivia': 'بوليفيا',
  'Venezuela': 'فنزويلا', 'Philippines': 'الفلبين', 'India': 'الهند',
  'Bahrain': 'البحرين', 'Oman': 'عمان', 'Kuwait': 'الكويت', 'UAE': 'الإمارات',
  'China PR': 'الصين', 'Thailand': 'تايلاند', 'Vietnam': 'فيتنام',
};

const groupNameAr: Record<string, string> = {
  'Group A': 'المجموعة A', 'Group B': 'المجموعة B', 'Group C': 'المجموعة C',
  'Group D': 'المجموعة D', 'Group E': 'المجموعة E', 'Group F': 'المجموعة F',
  'Group G': 'المجموعة G', 'Group H': 'المجموعة H', 'Group I': 'المجموعة I',
  'Group J': 'المجموعة J', 'Group K': 'المجموعة K', 'Group L': 'المجموعة L',
};

// Arab & highlighted teams
const highlightTeams = ['Egypt', 'Saudi Arabia', 'Morocco', 'Tunisia', 'Algeria', 'Iraq', 'Qatar', 'Jordan'];

export default function GroupStandings() {
  const [groups, setGroups] = useState<GroupStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState<string | null>('Group G');
  const [showAll, setShowAll] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await fetchAllGroupStandings();
    setGroups(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 120000); // Update every 2 mins
    return () => clearInterval(interval);
  }, []);

  if (loading && groups.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 text-center">
        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-white/50 text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>جاري تحميل ترتيب المجموعات...</p>
      </div>
    );
  }

  // Find the group with Egypt
  const egyptGroup = groups.find(g => g.teams.some(t => t.name === 'Egypt'));
  
  // Groups with Arab teams first
  const arabGroups = groups.filter(g => g.teams.some(t => highlightTeams.includes(t.name)));
  const otherGroups = groups.filter(g => !g.teams.some(t => highlightTeams.includes(t.name)));
  const sortedGroups = showAll ? [...arabGroups, ...otherGroups] : (egyptGroup ? [egyptGroup, ...arabGroups.filter(g => g !== egyptGroup)] : arabGroups);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-sm flex items-center gap-1.5" style={{ fontFamily: 'Cairo, sans-serif' }}>
          <Trophy className="w-4 h-4 text-yellow-400" />
          ترتيب المجموعات
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={load} className="text-green-400 hover:text-green-300 cursor-pointer" title="تحديث">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-white/30 text-[9px]" style={{ fontFamily: 'Cairo, sans-serif' }}>
        🟢 بيانات حقيقية من ESPN - تحديث تلقائي
      </p>

      <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
        {sortedGroups.map((group) => {
          const isExpanded = expandedGroup === group.name;
          const hasArab = group.teams.some(t => highlightTeams.includes(t.name));

          return (
            <div 
              key={group.name} 
              className={`bg-gradient-to-br from-white/5 to-white/[0.02] border rounded-xl overflow-hidden ${
                hasArab ? 'border-green-500/30' : 'border-white/10'
              }`}
            >
              <button
                onClick={() => setExpandedGroup(isExpanded ? null : group.name)}
                className="w-full flex items-center justify-between p-2.5 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <span className="text-white text-xs font-bold flex items-center gap-1.5" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {hasArab && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
                  {groupNameAr[group.name] || group.name}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {group.teams.slice(0, 4).map(t => (
                      <img key={t.name} src={t.logo} alt="" className="w-4 h-4 rounded-full border border-[#0d0d2e]" crossOrigin="anonymous" />
                    ))}
                  </div>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-white/40" /> : <ChevronDown className="w-3.5 h-3.5 text-white/40" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-2 pb-2">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="text-white/40 border-b border-white/5">
                        <th className="text-right py-1.5 px-1">#</th>
                        <th className="text-right py-1.5 px-1">المنتخب</th>
                        <th className="text-center py-1.5 px-0.5 w-5">لعب</th>
                        <th className="text-center py-1.5 px-0.5 w-5">ف</th>
                        <th className="text-center py-1.5 px-0.5 w-5">ت</th>
                        <th className="text-center py-1.5 px-0.5 w-5">خ</th>
                        <th className="text-center py-1.5 px-0.5 w-6">له</th>
                        <th className="text-center py-1.5 px-0.5 w-6">عليه</th>
                        <th className="text-center py-1.5 px-0.5 w-6">+/-</th>
                        <th className="text-center py-1.5 px-0.5 w-6 text-green-400 font-bold">نقاط</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.teams.map((team, idx) => {
                        const isHighlight = highlightTeams.includes(team.name);
                        return (
                          <tr
                            key={team.name}
                            className={`border-b border-white/5 last:border-0 ${
                              isHighlight ? 'bg-green-500/10' : ''
                            } ${team.qualified ? 'border-r-2 border-r-green-500' : idx < 2 ? 'border-r-2 border-r-green-500/30' : ''}`}
                          >
                            <td className="py-1.5 px-1 text-white/50 font-bold">{idx + 1}</td>
                            <td className="py-1.5 px-1">
                              <div className="flex items-center gap-1">
                                <img src={team.logo} alt="" className="w-4 h-4 rounded-full" crossOrigin="anonymous" />
                                <span className={`font-bold truncate max-w-[60px] ${isHighlight ? 'text-green-400' : 'text-white/80'}`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                                  {teamNameAr[team.name] || team.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-1.5 px-0.5 text-center text-white/60">{team.played}</td>
                            <td className="py-1.5 px-0.5 text-center text-white/60">{team.wins}</td>
                            <td className="py-1.5 px-0.5 text-center text-white/60">{team.draws}</td>
                            <td className="py-1.5 px-0.5 text-center text-white/60">{team.losses}</td>
                            <td className="py-1.5 px-0.5 text-center text-white/60">{team.goalsFor}</td>
                            <td className="py-1.5 px-0.5 text-center text-white/60">{team.goalsAgainst}</td>
                            <td className={`py-1.5 px-0.5 text-center font-bold ${team.goalDiff > 0 ? 'text-green-400' : team.goalDiff < 0 ? 'text-red-400' : 'text-white/40'}`}>
                              {team.goalDiff > 0 ? '+' : ''}{team.goalDiff}
                            </td>
                            <td className="py-1.5 px-0.5 text-center text-green-400 font-black">{team.points}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setShowAll(!showAll)}
        className="w-full text-center text-green-400 text-[10px] font-bold py-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg cursor-pointer transition-colors border border-green-500/20"
        style={{ fontFamily: 'Cairo, sans-serif' }}
      >
        {showAll ? '🔼 إخفاء باقي المجموعات' : `🔽 عرض كل المجموعات (${groups.length})`}
      </button>
    </div>
  );
}
