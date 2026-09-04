
import { createClient, createAdminClient } from "@insforge/sdk";
import type { DiagnosisResult } from "./types";

const insforge = createClient({
  baseUrl: process.env.INSFORGE_BASE_URL!,
  anonKey: process.env.INSFORGE_ANON_KEY!,
});

const insforgeAdmin = createAdminClient({
  baseUrl: process.env.INSFORGE_BASE_URL!,
  apiKey: process.env.INSFORGE_API_KEY!,
});

export default insforge;


export async function saveDiagnosis(
  data: Partial<DiagnosisResult>,
): Promise<DiagnosisResult> {
  const {data: result, error} = await insforge.database
  .from("diagnoses")
  .insert(data)
  .select()
  .single();

  if (error) throw new Error(`Failed to save diagnosis: ${error.message}`);

  return result as DiagnosisResult;
}


export async function updateDiagnosis(id: string, data: Partial<DiagnosisResult>): Promise<DiagnosisResult> {
  const {data: result, error} = await insforge.database
  .from("diagnoses")
  .update(data)
  .eq("id", id)
  .select()
  .single();

  if (error) throw new Error(`Failed to update diagnosis: ${error.message}`);
  return result as DiagnosisResult;
  
}


export async function getDiagnosis(id: string): Promise<DiagnosisResult> {
  const { data: result, error } = await insforge.database
  .from("diagnoses")
  .select()
  .eq("id", id)
  .single();

  if (error) throw new Error(`failed to get diagnosis: ${error.message}`);
  if (!result) throw new Error(`Diagnosis not found`);
  return result as DiagnosisResult;  
}


export async function getDiagnosisHistory(limit = 20): Promise<DiagnosisResult[]> {
  const { data: results, error } = await insforge.database
  .from("diagnoses")
  .select()
  .order("created_at", { ascending: false })
  .limit(limit);

  if (error) throw new Error(`failed to get diagnosis history: ${error.message}`);
  return (results ?? []) as DiagnosisResult[];
}


export async function uploadImageToStorage(file: Buffer | Blob, filename: string,

): Promise<string> {
  let blob: Blob;
  if (Buffer.isBuffer(file)) {
    const copy = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer
    blob = new Blob([copy])
  } else {
    blob = file
  }

  const { data, error } = await insforgeAdmin.storage
  .from("plant-image")
  .upload(filename, blob);

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
  if (!data?.url) {
    throw new Error('Failed to upload image: No URL returned');
  }
  return data.url;
}