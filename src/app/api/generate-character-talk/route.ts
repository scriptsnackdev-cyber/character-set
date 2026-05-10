import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET() {
  return Response.json({ status: 'API is active', method: 'GET' });
}

export async function POST(req: Request) {
  try {
    const { image, characterName, talkText } = await req.json();

    if (!image) {
      return Response.json({ error: 'Please upload a character image' }, { status: 400 });
    }

    const prompt = `
      This is a character illustration. Please generate a high-quality illustration that features THIS EXACT character from the attached image.
      
      Character & Scene Preservation:
      - Maintain the EXACT design, hair, outfit, facial features, and BACKGROUND of the image provided. 
      - Do NOT change the style. The output should look like the original image but with the added element below.
      
      Speech Bubble Feature:
      - Add a cute anime-style speech bubble (dialogue box) pointing to the character.
      - Inside the speech bubble, CLEARLY render the following text: "${talkText || 'Hello!'}"
      - The text MUST be perfectly legible and match the aesthetic of the character.
      
      Quality: Masterpiece, ultra-detailed, professional rendering.
      Layout: Maintain the original layout.
      
      Absolutely NO borders and NO frames.
    `;

    const imagenModelName = process.env.IMAGEN_MODEL || "gemini-3.1-flash-image-preview";
    const model = genAI.getGenerativeModel({ model: imagenModelName });
    
    // Prepare multi-modal content
    const contentParts: any[] = [
      prompt,
      {
        inlineData: {
          data: image.split(',')[1],
          mimeType: "image/jpeg"
        }
      }
    ];

    let result;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        result = await model.generateContent(contentParts);
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
    
    return Response.json({ 
      success: true, 
      imageUrl: imageUrl
    });

  } catch (error: any) {
    console.error('Generation Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
