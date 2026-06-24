import { Zap, Users, Globe, Clock } from 'lucide-react';

interface StatsBarProps {
  liveCount: number;
  totalCount: number;
  upcomingCount: number;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onShowTeams: () => void;
}

export default function StatsBar({ liveCount, totalCount, upcomingCount, activeFilter, onFilterChange, onShowTeams }: StatsBarProps) {
  const stats = [
    { id: 'live', icon: <Zap className="w-4 h-4 text-red-400" />, label: 'مباشر الآن', value: String(liveCount), color: 'text-red-400', activeColor: 'border-red-500/60 bg-red-500/10 shadow-red-500/20' },
    { id: 'all', icon: <Globe className="w-4 h-4 text-green-400" />, label: 'إجمالي المباريات', value: String(totalCount), color: 'text-green-400', activeColor: 'border-green-500/60 bg-green-500/10 shadow-green-500/20' },
    { id: 'upcoming', icon: <Clock className="w-4 h-4 text-blue-400" />, label: 'قادمة اليوم', value: String(upcomingCount), color: 'text-blue-400', activeColor: 'border-blue-500/60 bg-blue-500/10 shadow-blue-500/20' },
    { id: 'teams', icon: <Users className="w-4 h-4 text-yellow-400" />, label: 'المنتخبات', value: '48', color: 'text-yellow-400', activeColor: 'border-yellow-500/60 bg-yellow-500/10 shadow-yellow-500/20' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {stats.map((stat) => {
        const isActive = stat.id === activeFilter || (stat.id === 'teams' && activeFilter === 'teams');
        return (
          <button
            key={stat.id}
            onClick={() => stat.id === 'teams' ? onShowTeams() : onFilterChange(stat.id)}
            className={`rounded-xl p-3 flex items-center gap-2.5 transition-all duration-300 cursor-pointer text-right ${
              isActive 
                ? `${stat.activeColor} border-2 shadow-lg scale-[1.02]`
                : 'bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-white/10' : 'bg-white/5'}`}>
              {stat.icon}
            </div>
            <div>
              <p className={`text-lg font-black ${stat.color}`} style={{ fontFamily: 'Orbitron, sans-serif' }}>{stat.value}</p>
              <p className="text-[10px] text-white/50 font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>{stat.label}</p>
            </div>
            {stat.id === 'live' && liveCount > 0 && (
              <span className="w-2 h-2 bg-red-500 rounded-full mr-auto" />
            )}
          </button>
        );
      })}
    </div>
  );
}
