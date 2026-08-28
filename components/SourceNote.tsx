const tips = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="12" r="4"/>
        <line x1="12" y1="2" x2="12" y2="4"/>
        <line x1="12" y1="20" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="4" y2="12"/>
        <line x1="20" y1="12" x2="22" y2="12"/>
        <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/>
        <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/>
        <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/>
        <line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/>
      </svg>
    ),
    title: 'Diffuse natural light',
    description: 'Shade or overcast is best — direct sun creates glare that hides lesion detail.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="11" cy="11" r="7"/>
        <line x1="16.5" y1="16.5" x2="22" y2="22"/>
      </svg>
    ),
    title: 'Frame the affected area',
    description: 'Fill the frame with the sick leaf. More detail = more accurate result.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
      </svg>
    ),
    title: 'Plain background',
    description: 'White or neutral surface behind the leaf reduces visual noise.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="2" y="7" width="14" height="10" rx="2"/>
        <rect x="8" y="4" width="14" height="10" rx="2"/>
      </svg>
    ),
    title: 'Multiple angles',
    description: 'If symptoms are subtle, try 2–3 shots from slightly different angles.',
  },
]

export default function PhotoGuide() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-green-100 flex items-center justify-center">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Photo tips for better accuracy</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100">
        {tips.map((tip, i) => (
          <div key={i} className="p-4 flex flex-col gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
              {tip.icon}
            </div>
            <p className="text-xs font-semibold text-slate-700">{tip.title}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{tip.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}