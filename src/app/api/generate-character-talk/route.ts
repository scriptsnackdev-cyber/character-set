import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET() {
  return Response.json({ status: 'API is active', method: 'GET' });
}

export async function POST(req: Request) {
  try {
    const { image, images, characterName, talkText } = await req.json();

    const imageList = images || (image ? [image] : []);

    if (imageList.length === 0) {
      return Response.json({ error: 'Please upload at least one character image' }, { status: 400 });
    }

    const prompt = `
      This is a character illustration task. Please generate a high-quality illustration that features the EXACT character(s) from the attached ${imageList.length > 1 ? 'images' : 'image'}.
      
      Character & Scene Preservation:
      - Maintain the EXACT design, hair, outfit, facial features, and BACKGROUND of the character(s) provided in the ${imageList.length > 1 ? 'photos' : 'photo'}. 
      - Do NOT change the artistic style. The output should look like a professional recreation of the original but with the elements below.
      ${imageList.length > 1 ? '- If there are multiple images, arrange the characters together in a single cohesive scene while keeping their individual likenesses perfect.' : ''}
      
      ${talkText ? `Speech Bubble Feature:
      - Add a cute anime-style speech bubble (dialogue box) pointing to the main character.
      - Inside the speech bubble, CLEARLY render the following text: "${talkText}"
      - The text MUST be perfectly legible and match the aesthetic of the illustration.` : ''}
      
      Quality: Masterpiece, ultra-detailed, professional rendering.
      Layout: Maintain the original aspect ratio and layout style.
      
      Absolutely NO borders and NO frames.
    `;

    const imagenModelName = process.env.IMAGEN_MODEL || "gemini-3.1-flash-image-preview";
    const model = genAI.getGenerativeModel({ model: imagenModelName });
    
    // Prepare multi-modal content
    const contentParts: any[] = [prompt];
    imageList.forEach((imgBase64: string) => {
      contentParts.push({
        inlineData: {
          data: imgBase64.split(',')[1],
          mimeType: "image/jpeg"
        }
      });
    });

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
