import Link from 'next/link'

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    label: 'AI Vision',
    title: 'See what your plant is telling you',
    description: 'Claude AI reads visual symptoms the same way a plant pathologist would — distribution, tissue texture, lesion patterns.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    label: 'Honest Confidence',
    title: 'Calibrated to the real world',
    description: 'Scores reflect actual field accuracy — not inflated lab benchmarks. Ambiguous cases are flagged, not guessed.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    label: 'Research-Backed',
    title: 'Treatment from the literature',
    description: 'Every recommendation traces back to peer-reviewed plant pathology research — not gardening forums.',
  },
]

const steps = [
  { n: '01', text: 'Take a close-up photo of the affected leaf or stem' },
  { n: '02', text: 'Upload it — drag & drop or tap to browse' },
  { n: '03', text: 'Get a full diagnosis with confidence score and treatment plan' },
]

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-32 flex justify-center"
        >
          <div className="h-[500px] w-[900px] rounded-full bg-green-100 opacity-40 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3.5 py-1.5 text-xs font-medium text-green-700 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Powered by Gemini Vision
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-slate-900 leading-[1.05] tracking-tight mb-6">
            Know what&apos;s wrong<br />
            <span className="text-gradient">with your plant.</span>
          </h1>

          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed mb-10">
            Upload a photo and get an AI-powered diagnosis with treatment steps grounded in plant pathology research — in under 30 seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/upload"
              className="btn-glow inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-green-200 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="16 16 12 12 8 16"/>
                <line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
              Start Diagnosis
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm border border-slate-200 shadow-sm transition-colors"
            >
              View History
            </Link>
          </div>

          <p className="mt-5 text-xs text-slate-400">
            Treatment guidance informed by peer-reviewed plant pathology research
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <div className="rounded-2xl bg-slate-900 p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">How it works</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-4 items-start">
                <span className="font-display text-3xl font-semibold text-green-500 leading-none flex-shrink-0">{s.n}</span>
                <p className="text-sm text-slate-300 leading-relaxed pt-1">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Why PlantCheck</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900">Built for accuracy, not impressiveness</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-green-300 hover:shadow-lg hover:shadow-green-50 transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                {f.icon}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-1.5">{f.label}</p>
              <h3 className="font-semibold text-slate-900 text-[15px] mb-2 leading-snug">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}