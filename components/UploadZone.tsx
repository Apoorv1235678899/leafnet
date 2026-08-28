'use client'

import { useRef, useState, DragEvent, ChangeEvent } from 'react'

interface Props {
  onFileSelect: (file: File) => void
}

export default function UploadZone({ onFileSelect }: Props) {
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [sizeError, setSizeError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    onFileSelect(file)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    setSelectedFile(null)
    setSizeError(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="w-full">
      <div
        onClick={() => !selectedFile && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative w-full rounded-2xl border-2 border-dashed transition-all duration-200 ${
          dragging
            ? 'border-green-500 bg-green-50 scale-[1.01]'
            : selectedFile
            ? 'border-green-400 bg-white cursor-default'
            : 'border-slate-200 bg-slate-50 hover:border-green-400 hover:bg-green-50/40 cursor-pointer'
        }`}
        style={{ minHeight: '220px' }}
      >
        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center p-10 text-center h-full" style={{ minHeight: '220px' }}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${dragging ? 'bg-green-100' : 'bg-slate-100'}`}>
              <svg
                className={dragging ? 'text-green-600' : 'text-slate-400'}
                width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
              >
                <polyline points="16 16 12 12 8 16"/>
                <line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">
              {dragging ? 'Drop it here' : 'Drop your plant photo here'}
            </p>
            <p className="text-xs text-slate-400 mb-4">or click to browse from your device</p>
            <div className="flex gap-1.5 flex-wrap justify-center">
              {['JPEG', 'PNG', 'WebP', 'HEIC'].map((ext) => (
                <span key={ext} className="text-[10px] font-medium text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-white">
                  {ext}
                </span>
              ))}
              <span className="text-[10px] font-medium text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-white">
                max 10 MB
              </span>
            </div>
          </div>
        ) : (
          <div className="p-5 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative flex-shrink-0">
              <img
                src={preview!}
                alt="Plant preview"
                className="w-32 h-32 object-cover rounded-xl border border-slate-200 shadow-sm"
              />
              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-semibold text-slate-800 break-all">{selectedFile.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Ready to analyze</p>
              <button
                onClick={handleRemove}
                className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 mx-auto sm:mx-0"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                </svg>
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {sizeError && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          File is too large. Please upload an image under 10 MB.
        </div>
      )}

      <p className="mt-3 text-[11px] text-slate-400 leading-relaxed text-center">
        Diagnostic accuracy depends on image quality and is lower in real-world conditions than controlled benchmarks.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/heic"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}