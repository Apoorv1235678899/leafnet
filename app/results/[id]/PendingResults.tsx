'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoadingDiagnosis from '@/components/LoadingDiagnosis'

export default function PendingResults({ id }: { id: string }) {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.refresh()
    }, 3000)
    return () => clearTimeout(timer)
  }, [router, id])

  return (
    <div className="max-w-xl mx-auto text-center py-20">
      <LoadingDiagnosis steps={['complete', 'active', 'waiting']} />
    </div>
  )
}