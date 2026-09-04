
import { NextRequest } from "next/server";
import { analyzePlantImage } from "@/lib/gemini";
import { updateDiagnosis } from "@/lib/insforge";

const MIME_MAP: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
};

function getMimeFromUrl(url: string): string {
  const ext = url.split(".").pop()?.toLowerCase() ?? "jpg";
  return MIME_MAP[ext] ?? "image/jpeg";
}

export async function POST(request: NextRequest) {
  let diagnosis_id: string | undefined;

  try {
    const body = await request.json();

    const {
      image_url,
      diagnosis_id: id,
    } = body as {
      image_url?: string;
      diagnosis_id?: string;
    };

    if (!image_url) {
      return Response.json(
        { error: "image url is required" },
        { status: 400 }
      );
    }

    if (!id) {
      return Response.json(
        { error: "diagnosis_id is required" },
        { status: 400 }
      );
    }

    diagnosis_id = id;

    // Fetch the uploaded image from InsForge storage
    const imageResponse = await fetch(image_url);

    if (!imageResponse.ok) {
      throw new Error(
        `Failed to fetch image: ${imageResponse.statusText}`
      );
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const mimeType = getMimeFromUrl(image_url);

    console.log("[diagnose route] Starting Gemini analysis...");

    // Analyze image with Gemini
    const analysisResult = await analyzePlantImage(
      base64,
      mimeType
    );

    console.log("[diagnose route] Gemini analysis completed");

    // Save result to InsForge
    const updated = await updateDiagnosis(id, {
      ...analysisResult,
      status: "complete",
    });

    return Response.json(updated);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error";

    console.error("[diagnose route]", message);

    // Mark diagnosis as failed
    if (diagnosis_id) {
      try {
        await updateDiagnosis(diagnosis_id, {
          status: "error",
        });
      } catch (updateErr) {
        console.error(
          "[diagnose route] failed to mark error status",
          updateErr
        );
      }
    }

    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}
