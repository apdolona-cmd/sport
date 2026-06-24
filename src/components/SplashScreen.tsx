import { ChevronRight } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
}

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 bg-[#050510] z-50 flex items-center justify-center cursor-pointer" onClick={onEnter}>
      <div className="text-center px-6">
        <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl">
          <span className="text-4xl">⚽</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
          <span className="text-white">العرباوية</span>
          <span className="text-green-400"> ماتش</span>
        </h1>
        <p className="text-white/50 text-sm mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
          كأس العالم 2026 🏆 نتائج مباشرة
        </p>
        <p className="text-white/30 text-xs mb-8">🇺🇸 🇨🇦 🇲🇽</p>
        <button
          onClick={onEnter}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg px-8 py-3.5 rounded-full shadow-xl cursor-pointer active:scale-95"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          ادخل الآن
          <ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-white/15 text-[10px] mt-6">اضغط في أي مكان للدخول</p>
      </div>
    </div>
  );
}
