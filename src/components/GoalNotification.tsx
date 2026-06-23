import { useState, useEffect } from 'react';

interface GoalNotificationProps {
  team: string;
  teamLogo: string;
  player?: string;
  minute?: string;
  score: string;
  onClose: () => void;
}

export default function GoalNotification({ team, teamLogo, player, minute, score, onClose }: GoalNotificationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 500);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-green-500/50 flex items-center gap-4 min-w-[300px]">
        {/* Animated ball */}
        <div className="relative">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-2xl">⚽</span>
          </div>
          <div className="absolute inset-0 bg-white/10 rounded-full animate-ping" />
        </div>
        
        <div className="flex-1">
          <p className="text-lg font-black flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <span>هدف!</span>
            <span className="text-2xl">🎉</span>
          </p>
          <div className="flex items-center gap-2 mt-1">
            <img src={teamLogo} alt="" className="w-5 h-5" crossOrigin="anonymous" />
            <span className="font-bold">{team}</span>
            <span className="text-white/70 text-sm">({score})</span>
          </div>
          {player && (
            <p className="text-white/80 text-sm mt-0.5">
              ⭐ {player} {minute && `(${minute})`}
            </p>
          )}
        </div>

        <button onClick={() => { setShow(false); setTimeout(onClose, 500); }} className="text-white/50 hover:text-white cursor-pointer">
          ✕
        </button>
      </div>
    </div>
  );
}
