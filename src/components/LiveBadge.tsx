export default function LiveBadge({ minute }: { minute?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-red-500/40">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
        LIVE
      </span>
      {minute && (
        <span className="text-green-400 text-sm font-bold animate-pulse" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          {minute}
        </span>
      )}
    </div>
  );
}
