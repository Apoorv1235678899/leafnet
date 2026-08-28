

import Anthropic from '@anthropic-ai/sdk'
import type { DiagnosisResult } from './types'


const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})



export const PLANT_DIAGNOSIS_SYSTEM_PROMPT = `You are an expert plant pathologist with deep knowledge of plant diseases, nutrient deficiencies, and pest damage. Analyze the provided plant image using the following systematic diagnostic sequence:

1. SYMPTOM DISTRIBUTION: First assess where symptoms appear on the plant. Are they on old leaves, new growth, whole plant, or localized areas? Distribution pattern is critical for diagnosis.

2. TISSUE CHARACTERISTICS: Examine the specific visual properties of affected tissue. Note the color of lesions (brown, black, yellow, white, gray), the texture (powdery, wet, dry, sunken, raised), the margin definition (sharp or diffuse), and whether affected areas are necrotic or chlorotic.

3. DAMAGE PATTERN AND PROGRESSION: Consider how the damage pattern is arranged. Is it random, following vein patterns, circular, angular? Does it suggest a spreading pathogen or systemic issue?

4. CONTEXTUAL CLUES: Factor in any visible contextual information such as plant species indicators, soil surface, pot type, or environmental conditions visible in the image.

Based on this systematic assessment, respond ONLY with a valid JSON object in exactly this structure, no markdown, no explanation, just the raw JSON:

{
  "primary_diagnosis": "condition name here",
  "confidence_score": 78,
  "severity": "mild",
  "visual_markers": ["white powdery coating on upper leaf surface", "leaf edge curl at margins"],
  "top_possibilities": [
    { "condition": "Powdery Mildew", "confidence": 78 },
    { "condition": "Downy Mildew", "confidence": 14 },
    { "condition": "Calcium Deficiency", "confidence": 8 }
  ],
  "treatment_first_line": ["Apply neem oil solution weekly", "Improve air circulation around plant", "Remove heavily affected leaves"],
  "treatment_severe": ["Apply copper-based fungicide every 7 days", "Isolate plant from others", "Consider systemic fungicide if no improvement after 14 days"],
  "diagnostic_notes": "Include this field only if the case is ambiguous or two conditions have very similar presentations. Otherwise leave as empty string."
}

Important calibration rules:
- Set confidence_score to reflect real-world field accuracy, not controlled benchmark accuracy. If you would be 95 percent certain in ideal conditions, field conditions typically reduce this to 70-85 percent. Do not inflate confidence.
- Always include at least two alternative possibilities in top_possibilities even if the primary diagnosis is clear. The confidences of all possibilities combined do not need to sum to 100.
- If the image shows ambiguous early-stage symptoms where two conditions are genuinely difficult to distinguish, note this explicitly in diagnostic_notes and lower the confidence_score accordingly.
- severity must be exactly one of: mild, moderate, or severe. Base this on the percentage of plant tissue affected and the aggressiveness of symptom spread.`



export async function analyzePlantImage(
  base64Image: string,
  mimeType: string
): Promise<Partial<DiagnosisResult>> {
  const validMime = 
  mimeType === 'image/jpeg' ||
  mimeType === 'image/png' ||
  mimeType === 'image/gif' ||
  mimeType === 'image/webp' 
  ? mimeType 
  : 'image/jpeg';

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', 
            source: { 
              type: 'base64', 
              media_type: validMime as 
              | "image/jpeg"
              | "image/png"
              | "image/gif"
              | "image/webp",
              data: base64Image,
             },
            },
             { 
            type: 'text', 
            text: PLANT_DIAGNOSIS_SYSTEM_PROMPT,
           },
        ],
      },
    ],
  });


  const text = message.content
  .filter((b) => b.type === 'text')
  .map((b) => (b as { type: "text"; text: string }).text)
  .join('')
  .trim();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Claude returned a response with no JSON object");
  }

  try{
    return JSON.parse(jsonMatch[0]) as Partial<DiagnosisResult>;
  } catch {
    throw new Error(
  `Failed to parse Claude JSON response: ${text.slice(0, 200)}`,
);
}
}
