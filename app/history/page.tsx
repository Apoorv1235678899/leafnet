import Link from 'next/link'
import { getDiagnosisHistory } from '@/lib/insforge'
import SeverityBadge from '@/components/SeverityBadge'
import type { DiagnosisResult } from '@/lib/types'

export default async function HistoryPage() {
  let diagnoses: Awaited<ReturnType<typeof getDiagnosisHistory>> = []
  try {
    diagnoses = await getDiagnosisHistory(20)
  } catch {
    // fall through to empty state
  }

  const completed = diagnoses.filter((d) => d.status === 'complete')

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-2">Your records</p>
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-4xl font-semibold text-slate-900">Diagnosis History</h1>
          {completed.length > 0 && (
            <span className="text-sm text-slate-400 font-medium">
              {completed.length} {completed.length === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>
      </div>

      {completed.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.75">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-13.5 5.5.17-1.08.53-2.03 1.04-2.82A8 8 0 0 1 17 8z"/>
            </svg>
          </div>
          <p className="font-semibold text-slate-700 mb-1">No diagnoses yet</p>
          <p className="text-sm text-slate-400 mb-6">Upload a photo to get your first plant diagnosis.</p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-green-200"
          >
            Start Diagnosis
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {completed.map((d: DiagnosisResult) => (
            <Link
              key={d.id}
              href={`/results/${d.id}`}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 hover:border-green-300 hover:shadow-md hover:shadow-green-50 transition-all group"
            >
              {/* Thumbnail */}
              {d.image_url ? (
                <img
                  src={d.image_url}
                  alt={d.primary_diagnosis}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-100"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.75">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-13.5 5.5.17-1.08.53-2.03 1.04-2.82A8 8 0 0 1 17 8z"/>
                  </svg>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-semibold text-slate-900 truncate">{d.primary_diagnosis}</p>
                  <SeverityBadge severity={d.severity} />
                </div>
                <p className="text-xs text-slate-400">
                  {new Date(d.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </p>
              </div>

              {/* Confidence + arrow */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <p className="text-sm font-bold tabular-nums text-slate-700">{d.confidence_score}%</p>
                  <p className="text-[10px] text-slate-400">confidence</p>
                </div>
                <svg
                  className="text-slate-300 group-hover:text-green-500 transition-colors"
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                >
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}