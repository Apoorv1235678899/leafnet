
import { GoogleGenAI } from "@google/genai";
import type { DiagnosisResult } from "./types";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const PLANT_DIAGNOSIS_SYSTEM_PROMPT = `
You are an expert plant pathologist with deep knowledge of plant diseases, nutrient deficiencies, and pest damage.

Analyze the provided plant image using the following systematic diagnostic sequence:

1. SYMPTOM DISTRIBUTION:
First assess where symptoms appear on the plant. Are they on old leaves, new growth, whole plant, or localized areas? Distribution pattern is critical for diagnosis.

2. TISSUE CHARACTERISTICS:
Examine the specific visual properties of affected tissue. Note the color of lesions (brown, black, yellow, white, gray), the texture (powdery, wet, dry, sunken, raised), the margin definition (sharp or diffuse), and whether affected areas are necrotic or chlorotic.

3. DAMAGE PATTERN AND PROGRESSION:
Consider how the damage pattern is arranged. Is it random, following vein patterns, circular, angular? Does it suggest a spreading pathogen or systemic issue?

4. CONTEXTUAL CLUES:
Factor in any visible contextual information such as plant species indicators, soil surface, pot type, or environmental conditions visible in the image.

Based on this systematic assessment, return a diagnosis using the requested JSON structure.

Important calibration rules:

- Set confidence_score to reflect real-world field accuracy, not controlled benchmark accuracy. If you would be 95 percent certain in ideal conditions, field conditions typically reduce this to 70-85 percent. Do not inflate confidence.

- Always include at least two alternative possibilities in top_possibilities even if the primary diagnosis is clear. The confidences of all possibilities combined do not need to sum to 100.

- If the image shows ambiguous early-stage symptoms where two conditions are genuinely difficult to distinguish, note this explicitly in diagnostic_notes and lower the confidence_score accordingly.

- severity must be exactly one of: mild, moderate, or severe.

- Base severity on the percentage of plant tissue affected and the aggressiveness of symptom spread.

- Do not claim certainty when the image quality is poor or the visible symptoms are insufficient for a reliable diagnosis.
`;

async function generateWithRetry(
  request: Parameters<typeof ai.models.generateContent>[0],
  maxRetries = 3
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent(request);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);

      const isTemporaryError =
        message.includes("503") ||
        message.includes("UNAVAILABLE") ||
        message.includes("high demand");

      if (!isTemporaryError || attempt === maxRetries) {
        throw error;
      }

      console.log(
        `Gemini temporarily unavailable. Retrying in 5 seconds... (${attempt}/${maxRetries})`
      );

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  throw new Error("Gemini request failed after multiple attempts");
}

export async function analyzePlantImage(
  base64Image: string,
  mimeType: string
): Promise<Partial<DiagnosisResult>> {
  const validMime =
    mimeType === "image/jpeg" ||
    mimeType === "image/png" ||
    mimeType === "image/gif" ||
    mimeType === "image/webp"
      ? mimeType
      : "image/jpeg";

  try {
    const response = await generateWithRetry({
      model: "gemini-3.6-flash",
      contents: [
        {
          inlineData: {
            mimeType: validMime,
            data: base64Image,
          },
        },
        {
          text: PLANT_DIAGNOSIS_SYSTEM_PROMPT,
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            primary_diagnosis: {
              type: "string",
            },
            confidence_score: {
              type: "integer",
            },
            severity: {
              type: "string",
              enum: ["mild", "moderate", "severe"],
            },
            visual_markers: {
              type: "array",
              items: {
                type: "string",
              },
            },
            top_possibilities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  condition: {
                    type: "string",
                  },
                  confidence: {
                    type: "integer",
                  },
                },
                required: ["condition", "confidence"],
              },
            },
            treatment_first_line: {
              type: "array",
              items: {
                type: "string",
              },
            },
            treatment_severe: {
              type: "array",
              items: {
                type: "string",
              },
            },
            diagnostic_notes: {
              type: "string",
            },
          },
          required: [
            "primary_diagnosis",
            "confidence_score",
            "severity",
            "visual_markers",
            "top_possibilities",
            "treatment_first_line",
            "treatment_severe",
            "diagnostic_notes",
          ],
        },
      },
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    try {
      return JSON.parse(text) as Partial<DiagnosisResult>;
    } catch {
      throw new Error(
        `Failed to parse Gemini JSON response: ${text.slice(0, 200)}`
      );
    }
  } catch (error) {
    console.error("Gemini plant analysis error:", error);

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to analyze plant image"
    );
  }
}

