
import { NextRequest } from 'next/server'
import {saveDiagnosis, uploadImageToStorage} from '@/lib/insforge'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
const MAX_SIZE_BYTES = 10*1024*1024


export async function POST(request: NextRequest) {
  
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null
     
  if(!file){
    return Response.json({ success: false, error: 'No file provided' }, { status: 400 })
  }

  if(!ALLOWED_TYPES.includes(file.type)){
    return Response.json({ success: false, error: 'Invalid file type' }, { status: 400 })
  }

  if(file.size > MAX_SIZE_BYTES){
    return Response.json({ success: false, error: 'File size exceeds limit' }, { status: 400 })
  }
   const ext = file.name.split('.').pop() || 'jpg';
   const filename = `${crypto.randomUUID()}.${ext}`;

   const buffer = Buffer.from(await file.arrayBuffer());
   const imageUrl = await uploadImageToStorage(buffer, filename);

  const diagnosis = await saveDiagnosis({
    image_url: imageUrl,
    status: "pending",
    visual_markers: [],
    top_possibilities: [],
    treatment_first_line: [],
    treatment_severe: [],
    diagnostic_notes: "",
});
    
return Response.json({
  success: true,
  image_url: imageUrl,
  diagnosis_id: diagnosis.id,
});
    
} catch (err) {
  const message = err instanceof Error ? err.message : 'Unknown error'
  console.error('upload route', message)
  return Response.json({ success: false, error: message }, { status: 500 });
}
}