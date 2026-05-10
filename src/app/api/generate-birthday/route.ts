import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { image1, image2, characterName } = await req.json();

    if (!image1 && !image2) {
      return NextResponse.json({ error: 'Please upload at least one image' }, { status: 400 });
    }

    const imageData1 = image1 ? image1.split(',')[1] : null;
    const imageData2 = image2 ? image2.split(',')[1] : null;

    const prompt = `
      Please generate a super cute and festive "Birthday Celebration" illustration.
      
      Character(s): 
      ${imageData1 ? '- Character 1: Based on the first attached photo (likeness, hair style/color).' : ''}
      ${imageData2 ? '- Character 2: Based on the second attached photo (likeness, hair style/color).' : ''}
      
      Scene Concept:
      - The character(s) should be in a cute Chibi anime style.
      - They are holding a beautifully decorated, multi-layered birthday cake with glowing candles.
      - Festive atmosphere with colorful balloons, confetti, and sparkles in the background.
      - The vibe is extremely "Kawaii", joyful, and celebratory.
      
      Design Elements:
      - Style: Modern cute anime / Chibi style with soft vibrant colors.
      - Rendering: Magical sparkling kawaii illustration, soft dreamy lighting, high quality digital art.
      - Quality: Masterpiece, highly detailed, clean lineart.
      
      Absolutely NO borders, NO frames, and NO text in the illustration.
      Vertical portrait layout.
    `;

    const imagenModelName = process.env.IMAGEN_MODEL || "gemini-3.1-flash-image-preview";
    const model = genAI.getGenerativeModel({ model: imagenModelName });
    
    let result;
    const imagesToProcess = [];
    if (imageData1) imagesToProcess.push({ inlineData: { data: imageData1, mimeType: "image/jpeg" } });
    if (imageData2) imagesToProcess.push({ inlineData: { data: imageData2, mimeType: "image/jpeg" } });

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        result = await model.generateContent([
          prompt,
          ...imagesToProcess
        ]);
        break;
      } catch (err: any) {
        if (attempt === 2) throw new Error(`Imagen API Error: ${err.message}`);
        console.log(`Imagen attempt ${attempt} failed, retrying...`);
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    if (!result) {
        throw new Error("Failed to receive a result from Imagen after retries.");
    }
    
    let imageUrl = "";
    try {
      const response = result.response;
      const candidates = response.candidates;
      
      if (candidates && candidates.length > 0 && candidates[0].content && candidates[0].content.parts) {
        const parts = candidates[0].content.parts;
        const imagePart = parts.find((p: any) => p.inlineData || p.fileData);
        
        if (imagePart && imagePart.inlineData) {
          imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        } else if (imagePart && imagePart.fileData) {
          imageUrl = imagePart.fileData.fileUri;
        }
      }
    } catch (e) {
      console.error("Error extracting image:", e);
    }

    if (!imageUrl) {
      throw new Error("Model failed to generate an image.");
    }
    
    return NextResponse.json({ 
      success: true, 
      imageUrl: imageUrl
    });

  } catch (error: any) {
    console.error('Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
