interface Possibility {
  condition: string
  confidence: number
}

interface Props {
  possibilities: Possibility[]
}

export default function DifferentialList({ possibilities }: Props) {
  if (!possibilities || possibilities.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-800">Alternative possibilities</h3>
      </div>
      <div className="space-y-3">
        {possibilities.map((p, i) => (
          <div key={i} className={`rounded-xl p-3.5 border transition-colors ${
            i === 0
              ? 'border-green-200 bg-green-50/60'
              : 'border-slate-100 bg-slate-50/60'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  i === 0 ? 'bg-green-200 text-green-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  #{i + 1}
                </span>
                <span className="text-sm font-medium text-slate-800">{p.condition}</span>
              </div>
              <span className={`text-xs font-bold tabular-nums ${i === 0 ? 'text-green-700' : 'text-slate-500'}`}>
                {p.confidence}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white overflow-hidden border border-slate-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${p.confidence}%`,
                  backgroundColor: i === 0 ? '#16a34a' : '#94a3b8',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}