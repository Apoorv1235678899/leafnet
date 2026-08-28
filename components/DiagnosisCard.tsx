import type { DiagnosisResult } from '@/lib/types'
import ConfidenceBar from './ConfidenceBar'
import SeverityBadge from './SeverityBadge'

interface Props {
  diagnosis: DiagnosisResult
}

export default function DiagnosisCard({ diagnosis }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Severity colour strip at the top */}
      <div className="h-1.5 w-full" style={{
        background: diagnosis.severity === 'severe'
          ? 'linear-gradient(90deg, #ef4444, #f97316)'
          : diagnosis.severity === 'moderate'
          ? 'linear-gradient(90deg, #f59e0b, #eab308)'
          : 'linear-gradient(90deg, #16a34a, #22c55e)',
      }} />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Primary Diagnosis</p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight">
              {diagnosis.primary_diagnosis}
            </h2>
          </div>
          <div className="flex-shrink-0 mt-1">
            <SeverityBadge severity={diagnosis.severity} />
          </div>
        </div>

        <ConfidenceBar score={diagnosis.confidence_score} />

        {diagnosis.diagnostic_notes && (
          <div className="mt-5 flex gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3.5">
            <svg className="flex-shrink-0 mt-0.5 text-amber-500" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              <p className="text-xs font-bold text-amber-700 mb-0.5">Diagnostic note</p>
              <p className="text-sm text-amber-800 leading-relaxed">{diagnosis.diagnostic_notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}