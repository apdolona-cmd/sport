export default function LiveBadge({ minute }: { minute?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 bg-white rounded-full" />
        LIVE
      </span>
      {minute && (
        <span className="text-green-400 text-xs font-bold" style={{ fontFamily: 'Orbitron', direction: 'ltr' }}>
          {minute}
        </span>
      )}
    </div>
  );
}
