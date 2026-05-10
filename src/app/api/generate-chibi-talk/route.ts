import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET() {
  return Response.json({ status: 'API is active', method: 'GET' });
}

export async function POST(req: Request) {
  try {
    const { image, images, characterName, talkText, theme } = await req.json();

    // Support both single image and multiple images
    const imageList = images || (image ? [image] : []);

    if (imageList.length === 0) {
    return Response.json({ error: 'Please upload at least one image' }, { status: 400 });
    }

    const prompt = `
      Please generate a super cute Chibi anime character illustration based on the attached ${imageList.length > 1 ? 'photos' : 'photo'}.
      
      Character Identity:
      ${imageList.length > 1 
        ? `There are ${imageList.length} people in the attached photos. Please create a group of Chibi characters, one for each person, capturing their facial likeness, hair style, and hair color in a cute Chibi anime style.`
        : `Capture the facial likeness, hair style, and hair color of the person in the attached photo, rendered in a cute Chibi anime style.`
      }
      
      Design Concept:
      - The character(s) should be in cute, cheerful ${imageList.length > 1 ? 'poses' : 'pose'}.
      ${theme ? `- Theme/Atmosphere: ${theme}. Incorporate elements of this theme into the background and outfit.` : '- Atmosphere: Bright, magical, and fun aesthetics.'}
      - Style: Modern Japanese Chibi anime style.
      - Rendering: Soft dreamy gradients, clean lineart, professional illustration.
      
      Sticker-Style Text (CRITICAL):
      - Render the following text directly on the image as part of the illustration: "${talkText || 'Hello!'}"
      - TEXT STYLE: The text MUST have a VERY thick, clean white outline (stroke) and a bright red inner fill color. 
      - FONT STYLE: Use a bold, cute, rounded "pop" anime-style font (similar to a YouTube thumbnail or a premium LINE sticker).
      - NO BOX: Do NOT use any speech bubble, dialogue box, or background container. The text must be rendered directly on top of the character/background.
      - POSITION: Position the text in a stylish, legible way at the bottom or near the main character.
      
      Quality: Masterpiece, ultra-detailed.
      Vertical portrait layout.
      
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
