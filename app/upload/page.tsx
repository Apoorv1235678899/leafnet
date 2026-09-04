'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PhotoGuide from '@/components/PhotoGuide'
import UploadZone from '@/components/UploadZone'
import LoadingDiagnosis from '@/components/LoadingDiagnosis'

type StepStatus = 'waiting' | 'active' | 'complete'

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [steps, setSteps] = useState<[StepStatus, StepStatus, StepStatus]>(['waiting', 'waiting', 'waiting'])
  const [error, setError] = useState<string | null>(null)

  const setStep = (idx: 0 | 1 | 2, status: StepStatus) => {
    setSteps((prev) => {
      const next = [...prev] as [StepStatus, StepStatus, StepStatus]
      next[idx] = status
      return next
    })
  }



  const handleAnalyze = async () => {
    if (!file) return
    setError(null);
    setLoading(true);
    setSteps(['active', 'waiting', 'waiting']);

    try {
      const form = new FormData();
      form.append('image', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });
      const uploadData = await uploadRes.json()

      if (!uploadRes.ok || !uploadData.success) throw new Error(uploadData.error ?? 'Upload failed');
      setStep(0, 'complete');
      setStep(1, 'active');

      const diagnoseRes = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: uploadData.image_url,
          diagnosis_id: uploadData.diagnosis_id,
        }),
      });

      const diagnoseData = await diagnoseRes.json();

      if (!diagnoseRes.ok) {
        throw new Error(diagnoseData.error ?? 'Diagnosis failed');
      }

      setStep(1, 'complete');
      setStep(2, 'active');

      await new Promise((r) => setTimeout(r, 500));

      router.push(`/results/${uploadData.diagnosis_id}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
      setSteps(['waiting', 'waiting', 'waiting']);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-2">Plant Diagnosis</p>
        <h1 className="font-display text-4xl font-semibold text-slate-900 leading-tight">
          Upload your plant photo
        </h1>
        <p className="mt-2 text-sm text-slate-500">Get a full AI diagnosis with treatment steps in under 30 seconds.</p>
      </div>

      {/* Photo tips */}
      <div className="mb-6">
        <PhotoGuide />
      </div>

      {/* Upload zone */}
      <UploadZone onFileSelect={setFile} />

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}. Please try again.
        </div>
      )}

      {/* CTA button */}
      <button
        onClick={handleAnalyze}
        disabled={!file || loading}
        className="mt-5 w-full py-4 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2.5 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        style={{
          background: file && !loading ? 'linear-gradient(135deg, #16a34a, #15803d)' : '#94a3b8',
          boxShadow: file && !loading ? '0 8px 24px -4px rgba(22, 163, 74, 0.35)' : 'none',
        }}
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Analyzing…
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
            Analyze Plant
          </>
        )}
      </button>

      {/* Loading stepper */}
      {loading && (
        <div className="mt-5">
          <LoadingDiagnosis steps={steps} />
        </div>
      )}
    </div>
  )
}