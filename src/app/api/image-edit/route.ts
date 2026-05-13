import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { image, prompt: userPrompt } = await req.json();

    if (!image || !userPrompt) {
      return Response.json({ error: 'Please provide both an image and a prompt' }, { status: 400 });
    }

    const systemPrompt = `
      CRITICAL TASK: IMAGE EDITING & MODIFICATION
      
      I have attached an image. Please modify it based on the following USER REQUEST:
      "${userPrompt}"
      
      STRICT REQUIREMENTS:
      1. CONSISTENCY: Maintain the overall style, lighting, composition, and subjects of the original image unless explicitly asked to change them.
      2. PRECISION: Focus specifically on the changes requested by the user.
      3. REALISM/ARTISTRY: Ensure the edits look natural and integrated with the rest of the image.
      4. IMAGE-TO-IMAGE: Use the provided image as the base reference for all generation.
    `;

    const imagenModelName = process.env.IMAGEN_MODEL || "gemini-3.1-flash-image-preview";
    const model = genAI.getGenerativeModel({ model: imagenModelName });
    
    const getMimeType = (base64: string) => {
      const match = base64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
      return match ? match[1] : 'image/jpeg';
    };

    const contentParts: any[] = [
      systemPrompt,
      {
        inlineData: {
          data: image.split(',')[1],
          mimeType: getMimeType(image)
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
        console.log(`Image Edit attempt ${attempt} failed, retrying...`);
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
    console.error('Image Edit Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
