interface Props {
  markers: string[]
}

export default function VisualMarkers({ markers }: Props) {
  if (!markers || markers.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-800">What the AI detected</h3>
      </div>
      <ul className="space-y-2.5">
        {markers.map((marker, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
            <span className="w-5 h-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
            <span className="leading-relaxed">{marker}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}