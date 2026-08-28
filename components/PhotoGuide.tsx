type StepStatus = 'waiting' | 'active' | 'complete'

interface Props {
  steps?: [StepStatus, StepStatus, StepStatus]
}

const labels = [
  { text: 'Uploading photo', sub: 'Sending to secure storage' },
  { text: 'Analyzing with AI', sub: 'Claude is reading the image' },
  { text: 'Saving results', sub: 'Almost done' },
]

export default function LoadingDiagnosis({ steps = ['active', 'waiting', 'waiting'] }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="space-y-4">
        {steps.map((status, i) => (
          <div key={i} className="flex items-center gap-4">
            {/* Status icon */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
              status === 'complete' ? 'bg-green-100' :
              status === 'active'   ? 'bg-green-600' :
                                      'bg-slate-100'
            }`}>
              {status === 'complete' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
              {status === 'active' && (
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              )}
              {status === 'waiting' && (
                <div className="w-2 h-2 rounded-full bg-slate-300" />
              )}
            </div>

            {/* Label */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                status === 'complete' ? 'text-green-700' :
                status === 'active'   ? 'text-slate-900' :
                                        'text-slate-400'
              }`}>
                {labels[i].text}
              </p>
              <p className={`text-xs ${status !== 'waiting' ? 'text-slate-400' : 'text-slate-300'}`}>
                {labels[i].sub}
              </p>
            </div>

            {/* Step number */}
            <span className={`text-xs font-semibold tabular-nums ${
              status === 'complete' ? 'text-green-600' :
              status === 'active'   ? 'text-slate-600' :
                                      'text-slate-300'
            }`}>
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
        This usually takes 10–20 seconds
      </p>
    </div>
  )
}