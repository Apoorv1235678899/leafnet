import Link from 'next/link'
import { getDiagnosis } from '@/lib/insforge'
import DiagnosisCard from '@/components/DiagnosisCard'
import VisualMarkers from '@/components/VisualMarkers'
import DifferentialList from '@/components/DifferentialList'
import TreatmentPanel from '@/components/TreatmentPanel'
import SourceNote from '@/components/SourceNote'
import ShareButton from './ShareButton'
import PendingResults from './PendingResults'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ResultsPage({ params }: Props) {
  const { id } = await params

  let diagnosis = null
  let fetchError = false

  try {
    diagnosis = await getDiagnosis(id)
  } catch {
    fetchError = true
  }

  // Error / not-found state
  if (fetchError || !diagnosis || diagnosis.status === 'error') {
    return (
      <div className="max-w-md mx-auto text-center py-24">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.75">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2 className="font-display text-xl font-semibold text-slate-900 mb-2">Diagnosis unavailable</h2>
        <p className="text-sm text-slate-500 mb-6">This diagnosis could not be loaded. The image may have been unclear or the analysis timed out.</p>
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Try again
        </Link>
      </div>
    )
  }

  // Still processing — poll every 3s
  if (diagnosis.status === 'pending') {
    return <PendingResults id={id} />
  }

  return (
    <div className="max-w-4xl mx-auto pb-16">

      {/* Back + share row */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/upload"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          New diagnosis
        </Link>
        <ShareButton />
      </div>

      {/* Hero row — image + diagnosis title */}
      <div className="flex flex-col sm:flex-row gap-6 items-start mb-7">
        {diagnosis.image_url && (
          <div className="w-full sm:w-56 flex-shrink-0">
            <img
              src={diagnosis.image_url}
              alt="Plant photo"
              className="w-full sm:w-56 h-52 object-cover rounded-2xl border border-slate-200 shadow-sm"
            />
          </div>
        )}
        <div className="flex-1 min-w-0 pt-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-2">Diagnosis Complete</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 leading-tight mb-3">
            {diagnosis.primary_diagnosis}
          </h1>
          <p className="text-xs text-slate-400">
            Analyzed{' '}
            {new Date(diagnosis.created_at).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Diagnosis summary card */}
      <div className="mb-6">
        <DiagnosisCard diagnosis={diagnosis} />
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <VisualMarkers markers={diagnosis.visual_markers} />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <DifferentialList possibilities={diagnosis.top_possibilities} />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <TreatmentPanel
            firstLine={diagnosis.treatment_first_line}
            severe={diagnosis.treatment_severe}
          />
        </div>
      </div>

      {/* Research disclaimer */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 px-5 py-4">
        <SourceNote />
      </div>
    </div>
  )
}