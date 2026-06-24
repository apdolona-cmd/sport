export default function Header() {
  return (
    <header className="bg-gradient-to-r from-[#0a0a2e] via-[#1a1a4e] to-[#0a0a2e] border-b border-green-500/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg text-xl">
              ⚽
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-black text-white leading-tight" style={{ fontFamily: 'Cairo, sans-serif' }}>
                العرباوية<span className="text-green-400"> ماتش</span>
              </h1>
              <p className="text-[9px] text-green-300/60 font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                كأس العالم 2026 - نتائج مباشرة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 rounded-full px-2.5 py-1">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-red-400 text-[10px] font-bold" style={{ fontFamily: 'Cairo' }}>مباشر</span>
            </div>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
              <span className="text-sm">🏆</span>
              <span className="text-white/60 text-[10px] font-bold hidden sm:inline" style={{ fontFamily: 'Cairo' }}>FIFA 2026</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
