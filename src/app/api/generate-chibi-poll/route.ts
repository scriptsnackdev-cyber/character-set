import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { image, characterName, role } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'Please upload an image' }, { status: 400 });
    }

    const imageData = image.split(',')[1];

    const roleText = role === 'Seme' ? 'SEME (เมะ)' : role === 'Uke' ? 'UKE (เคะ)' : 'SWITCH (รับ/รุก)';
    const roleTheme = role === 'Seme' ? 'cool and confident' : role === 'Uke' ? 'soft and adorable' : 'versatile and charming';

    const prompt = `
      Please generate a super cute Chibi anime character based on the attached photo.
      
      Character Identity: Capture the facial likeness, hair style, and hair color of the person in the attached photo, rendered in a cute Chibi anime style.
      
      Design Concept:
      - The character should be ${roleTheme}.
      - Atmosphere: Magical, sparkling, dreamy pink aesthetics.
      - Style: Modern Japanese Chibi anime style.
      - Rendering: Soft dreamy gradients, clean lineart, professional illustration.
      
      Quality: Masterpiece, ultra-detailed.
      Vertical portrait layout.
      
      Absolutely NO borders, NO frames, and NO text in the illustration.
    `;

    const imagenModelName = process.env.IMAGEN_MODEL || "gemini-3.1-flash-image-preview";
    const model = genAI.getGenerativeModel({ model: imagenModelName });
    
    let result;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: imageData,
              mimeType: "image/jpeg"
            }
          }
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
