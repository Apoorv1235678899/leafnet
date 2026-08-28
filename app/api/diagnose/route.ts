 

import { NextRequest } from 'next/server'
import { analyzePlantImage } from '@/lib/gemini'
import { updateDiagnosis } from '@/lib/insforge'


const MIME_MAP: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
}

function getMimeFromUrl(url: string): string {
  const ext = url.split('.').pop()?.toLowerCase() ?? 'jpg'
  return MIME_MAP[ext] ?? 'image/jpeg'
}

export async function POST(request: NextRequest) {
  let diagnosis_id: string | undefined

  try {
    const body =  await request.json();
    const { image_url, diagnosis_id: id} = body  as { image_url?: string;
      diagnosis_id?: string;
    };

    if (!image_url) {
      return Response.json(
        { error: " image url is required"},
        { status:  400},
      );
    }
     
    diagnosis_id = id;

    const analysisPromise = async () => {
  const imageResponse = await fetch(image_url);

  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
  }

  const arrayBuffer = await imageResponse.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const mimeType = getMimeFromUrl(image_url);

  return analyzePlantImage(base64, mimeType);
};

const timeoutPromise = new Promise<never>((_, reject) => {
  setTimeout(
    () => reject(new Error("Analysis timed out. Please try again.")),
    25000,
  );
});

const analysisResult = await Promise.race([
  analysisPromise(),
  timeoutPromise,
]);

    const updated = await updateDiagnosis(id!, {
      ...analysisResult,
      status: "complete",
    });
   
    return Response.json(updated);
  
    } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[diagnose route]', message)

    // Mark the diagnosis row as 'error' so the UI can show the failure state
    if (diagnosis_id) {
      try {
        await updateDiagnosis(diagnosis_id, { status: 'error' })
      } catch (updateErr) {
        console.error('[diagnose route] failed to mark error status', 
          updateErr,
        );
      }
    }

    if (message === 'TIMEOUT') {
      return Response.json(
        { error: 'Analysis timed out. Please try again.' },
         { status: 504 },
        );
    }

    return Response.json({ error: message }, { status: 500 });
  }
}