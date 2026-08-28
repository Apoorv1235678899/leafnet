interface Props {
  score: number
}

export default function ConfidenceBar({ score }: Props) {
  const color =
    score > 70  ? { bar: '#16a34a', bg: '#dcfce7', text: '#15803d' } :
    score >= 50 ? { bar: '#f59e0b', bg: '#fef3c7', text: '#b45309' } :
                  { bar: '#ef4444', bg: '#fee2e2', text: '#dc2626' }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Confidence</span>
        <span className="text-sm font-bold tabular-nums" style={{ color: color.text }}>{score}%</span>
      </div>
      <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: color.bg }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color.bar }}
        />
      </div>
    </div>
  )
}