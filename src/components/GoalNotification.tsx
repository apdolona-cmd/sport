import { useEffect } from 'react';

interface GoalNotificationProps {
  team: string;
  teamLogo: string;
  score: string;
  onClose: () => void;
}

export default function GoalNotification({ team, teamLogo, score, onClose }: GoalNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3">
        <span className="text-2xl">⚽</span>
        <div>
          <p className="text-sm font-black" style={{ fontFamily: 'Cairo' }}>هدف! 🎉</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <img src={teamLogo} alt="" className="w-4 h-4" crossOrigin="anonymous" />
            <span className="font-bold text-sm">{team}</span>
            <span className="text-white/70 text-xs">({score})</span>
          </div>
        </div>
        <button onClick={onClose} className="text-white/50 mr-2 cursor-pointer text-lg">✕</button>
      </div>
    </div>
  );
}
