
export interface DiagnosisResult {
  id: string
  created_at: string
  image_url: string
  primary_diagnosis: string
  confidence_score: number
  severity: 'mild' | 'moderate' | 'severe'
  visual_markers: string[]
  top_possibilities: Array<{
    condition: string
    confidence: number
  }>
  treatment_first_line: string[]
  treatment_severe: string[]
  diagnostic_notes: string
  status: 'pending' | 'complete' | 'error'
}

export interface UploadResponse {
  success: boolean
  image_url: string
  diagnosis_id?: string
  error?: string
}

export interface DiagnoseRequest {
  image_url: string
  diagnosis_id: string
}