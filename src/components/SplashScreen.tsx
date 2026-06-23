import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
}

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setReady(true));
  }, []);

  return (
    <div className="fixed inset-0 bg-[#030308] z-50 flex items-center justify-center overflow-hidden cursor-pointer" onClick={onEnter}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className={`relative z-10 text-center px-6 transition-all duration-300 ${ready ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 animate-bounce">
          <span className="text-4xl">⚽</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
          <span className="text-white">العرباوية</span><span className="text-green-400"> ماتش</span>
        </h1>
        <p className="text-white/50 text-sm mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>كأس العالم 2026 🏆 نتائج مباشرة لحظة بلحظة</p>
        <div className="flex items-center justify-center gap-1 text-xs mb-8 text-white/30">🇺🇸 🇨🇦 🇲🇽</div>
        <button onClick={onEnter}
          className="group inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold text-lg px-8 py-3.5 rounded-full shadow-2xl shadow-green-500/40 cursor-pointer hover:scale-105 transition-transform"
          style={{ fontFamily: 'Cairo, sans-serif' }}>
          ادخل الآن
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-white/15 text-[10px] mt-6">اضغط في أي مكان للدخول</p>
      </div>
    </div>
  );
}
