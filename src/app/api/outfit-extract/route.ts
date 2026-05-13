import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { characterImage } = await req.json();

    if (!characterImage) {
      return Response.json({ error: 'Please upload a character image' }, { status: 400 });
    }

    const prompt = `
      CRITICAL TASK: OUTFIT EXTRACTION (PRODUCT PHOTOGRAPHY)
      
      I have attached an image of a character/person.
      
      STRICT REQUIREMENTS:
      1. EXTRACT OUTFIT: Identify all items of clothing (shirts, jackets, pants, skirts, shoes) and visible accessories (hats, bags, jewelry).
      2. PURE WHITE BACKGROUND: Generate the extracted items arranged neatly on a solid, clean, plain #FFFFFF white background.
      3. PRODUCT STYLE: The items should look like professional product photography (lay-flat or invisible mannequin style).
      4. NO HUMAN: Ensure absolutely NO human body parts, skin, face, or hair are visible in the generated image.
      5. HIGH FIDELITY: Maintain the exact colors, textures, patterns, and logos from the original outfit.
      
      The result should be just the clothes and accessories, floating or laid out on a white background, ready for use as assets.
    `;

    const imagenModelName = process.env.IMAGEN_MODEL || "gemini-3.1-flash-image-preview";
    const model = genAI.getGenerativeModel({ model: imagenModelName });
    
    const getMimeType = (base64: string) => {
      const match = base64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
      return match ? match[1] : 'image/jpeg';
    };

    const contentParts: any[] = [
      prompt,
      {
        inlineData: {
          data: characterImage.split(',')[1],
          mimeType: getMimeType(characterImage)
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
        console.log(`Outfit Extract attempt ${attempt} failed, retrying...`);
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
    console.error('Outfit Extract Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
