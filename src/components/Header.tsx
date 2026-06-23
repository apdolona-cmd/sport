import { Signal } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-[#0a0a2e] via-[#1a1a4e] to-[#0a0a2e] border-b border-green-500/30">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,255,100,0.1) 50px, rgba(0,255,100,0.1) 51px)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 text-2xl">
                ⚽
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center animate-ping" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center">
                <Signal className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
                العرباوية<span className="text-green-400"> ماتش</span>
              </h1>
              <p className="text-[10px] text-green-300/70 font-semibold tracking-wider" style={{ fontFamily: 'Cairo, sans-serif' }}>
                كأس العالم 2026 - نتائج مباشرة لحظة بلحظة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-full px-3 py-1.5">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-xs font-bold tracking-wider" style={{ fontFamily: 'Cairo, sans-serif' }}>مباشر</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <span className="text-lg">🏆</span>
              <span className="text-white/70 text-xs font-bold hidden md:inline" style={{ fontFamily: 'Cairo, sans-serif' }}>FIFA 2026</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
