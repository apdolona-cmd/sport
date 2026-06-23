import { X, Search } from 'lucide-react';
import { useState } from 'react';

interface TeamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  getArabicName: (name: string) => string;
}

const ALL_TEAMS = [
  // Group A
  { name: 'Mexico', group: 'A', flag: '🇲🇽' },
  { name: 'South Korea', group: 'A', flag: '🇰🇷' },
  { name: 'Czechia', group: 'A', flag: '🇨🇿' },
  { name: 'South Africa', group: 'A', flag: '🇿🇦' },
  // Group B
  { name: 'United States', group: 'B', flag: '🇺🇸' },
  { name: 'Turkey', group: 'B', flag: '🇹🇷' },
  { name: 'Australia', group: 'B', flag: '🇦🇺' },
  { name: 'Paraguay', group: 'B', flag: '🇵🇾' },
  // Group C
  { name: 'Canada', group: 'C', flag: '🇨🇦' },
  { name: 'Switzerland', group: 'C', flag: '🇨🇭' },
  { name: 'Qatar', group: 'C', flag: '🇶🇦' },
  { name: 'Bosnia and Herzegovina', group: 'C', flag: '🇧🇦' },
  // Group D
  { name: 'Brazil', group: 'D', flag: '🇧🇷' },
  { name: 'Morocco', group: 'D', flag: '🇲🇦' },
  { name: 'Scotland', group: 'D', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { name: 'Haiti', group: 'D', flag: '🇭🇹' },
  // Group E
  { name: 'Germany', group: 'E', flag: '🇩🇪' },
  { name: 'Netherlands', group: 'E', flag: '🇳🇱' },
  { name: 'Ecuador', group: 'E', flag: '🇪🇨' },
  { name: 'Curaçao', group: 'E', flag: '🇨🇼' },
  // Group F
  { name: 'Japan', group: 'F', flag: '🇯🇵' },
  { name: 'Sweden', group: 'F', flag: '🇸🇪' },
  { name: 'Tunisia', group: 'F', flag: '🇹🇳' },
  { name: 'Ivory Coast', group: 'F', flag: '🇨🇮' },
  // Group G
  { name: 'Belgium', group: 'G', flag: '🇧🇪' },
  { name: 'Egypt', group: 'G', flag: '🇪🇬' },
  { name: 'Iran', group: 'G', flag: '🇮🇷' },
  { name: 'New Zealand', group: 'G', flag: '🇳🇿' },
  // Group H
  { name: 'Spain', group: 'H', flag: '🇪🇸' },
  { name: 'Saudi Arabia', group: 'H', flag: '🇸🇦' },
  { name: 'Uruguay', group: 'H', flag: '🇺🇾' },
  { name: 'Cape Verde', group: 'H', flag: '🇨🇻' },
  // Group I
  { name: 'France', group: 'I', flag: '🇫🇷' },
  { name: 'Norway', group: 'I', flag: '🇳🇴' },
  { name: 'Senegal', group: 'I', flag: '🇸🇳' },
  { name: 'Iraq', group: 'I', flag: '🇮🇶' },
  // Group J
  { name: 'Argentina', group: 'J', flag: '🇦🇷' },
  { name: 'Austria', group: 'J', flag: '🇦🇹' },
  { name: 'Algeria', group: 'J', flag: '🇩🇿' },
  { name: 'Jordan', group: 'J', flag: '🇯🇴' },
  // Group K
  { name: 'England', group: 'K', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Colombia', group: 'K', flag: '🇨🇴' },
  { name: 'Ghana', group: 'K', flag: '🇬🇭' },
  { name: 'Panama', group: 'K', flag: '🇵🇦' },
  // Group L
  { name: 'Portugal', group: 'L', flag: '🇵🇹' },
  { name: 'Croatia', group: 'L', flag: '🇭🇷' },
  { name: 'Uzbekistan', group: 'L', flag: '🇺🇿' },
  { name: 'DR Congo', group: 'L', flag: '🇨🇩' },
];

const ARAB_TEAMS = ['Egypt', 'Saudi Arabia', 'Morocco', 'Tunisia', 'Algeria', 'Iraq', 'Qatar', 'Jordan'];

export default function TeamsModal({ isOpen, onClose, getArabicName }: TeamsModalProps) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = search
    ? ALL_TEAMS.filter(t => getArabicName(t.name).includes(search) || t.name.toLowerCase().includes(search.toLowerCase()) || t.group.includes(search.toUpperCase()))
    : ALL_TEAMS;

  const grouped = filtered.reduce<Record<string, typeof ALL_TEAMS>>((acc, t) => {
    if (!acc[t.group]) acc[t.group] = [];
    acc[t.group].push(t);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-gradient-to-br from-[#1a1a3e] to-[#0d0d2e] rounded-2xl w-full max-w-lg border border-white/10 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <h2 className="text-white font-bold text-lg flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
            🌍 المنتخبات المشاركة
            <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>48</span>
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pt-3 pb-2 shrink-0">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="ابحث عن منتخب أو مجموعة..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-green-500/50"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            />
          </div>
        </div>

        {/* Teams grid */}
        <div className="flex-1 overflow-y-auto p-4 pt-1 custom-scrollbar">
          {Object.keys(grouped).sort().map(group => (
            <div key={group} className="mb-4 last:mb-0">
              <h3 className="text-white/50 text-xs font-bold mb-2 sticky top-0 bg-[#151535] py-1 z-10" style={{ fontFamily: 'Cairo, sans-serif' }}>
                المجموعة {group}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {grouped[group].map(team => {
                  const isArab = ARAB_TEAMS.includes(team.name);
                  return (
                    <div
                      key={team.name}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                        isArab 
                          ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xl">{team.flag}</span>
                      <div>
                        <p className={`text-xs font-bold ${isArab ? 'text-green-400' : 'text-white'}`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                          {getArabicName(team.name)}
                        </p>
                        <p className="text-[9px] text-white/40">مجموعة {team.group}</p>
                      </div>
                      {isArab && <span className="text-[9px] mr-auto text-green-400/60">عربي</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {Object.keys(grouped).length === 0 && (
            <div className="text-center py-10 text-white/40">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>لا توجد نتائج</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-black/20 shrink-0">
          <p className="text-center text-white/30 text-[10px]" style={{ fontFamily: 'Cairo, sans-serif' }}>
            🇪🇬🇸🇦🇲🇦🇹🇳🇩🇿🇮🇶🇶🇦🇯🇴 8 منتخبات عربية في كأس العالم 2026
          </p>
        </div>
      </div>
    </div>
  );
}
