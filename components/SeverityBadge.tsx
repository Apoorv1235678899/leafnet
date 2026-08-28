type Severity = 'mild' | 'moderate' | 'severe'

const styles: Record<Severity, { bg: string; text: string; dot: string }> = {
  mild:     { bg: '#f0fdf4', text: '#15803d', dot: '#16a34a' },
  moderate: { bg: '#fffbeb', text: '#b45309', dot: '#f59e0b' },
  severe:   { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
}

interface Props {
  severity: Severity
}

export default function SeverityBadge({ severity }: Props) {
  const s = styles[severity] ?? styles.mild
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.dot }} />
      {severity}
    </span>
  )
}