'use client'

import { useState } from 'react'

interface Props {
  firstLine: string[]
  severe: string[]
}

export default function TreatmentPanel({ firstLine, severe }: Props) {
  const [activeTab, setActiveTab] = useState<'first' | 'severe'>('first')

  const steps = activeTab === 'first' ? firstLine : severe

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-800">Treatment plan</h3>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-slate-100 p-1 mb-5 gap-1">
        {(['first', 'severe'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === tab
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'first' ? 'First-line' : 'Severe cases'}
          </button>
        ))}
      </div>

      {/* Steps */}
      {steps && steps.length > 0 ? (
        <ol className="space-y-3 flex-1">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3.5">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-slate-600 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-slate-400 italic">No steps available.</p>
      )}

      <p className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed">
        Treatment guidance informed by published plant pathology research.
      </p>
    </div>
  )
}