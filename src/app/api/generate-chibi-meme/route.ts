import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { characterImage, memeImage } = await req.json();

    if (!characterImage || !memeImage) {
      return Response.json({ error: 'Please upload both character and meme images' }, { status: 400 });
    }

    const prompt = `
      ABSOLUTE PRIORITY: STRUCTURAL CLONE OF THE SECOND IMAGE (MEME TEMPLATE).
      
      You must perform a high-fidelity character replacement. The output must be an EXACT structural, spatial, and lighting replica of the "Meme Template" (2nd image), but with the identity features of the "Character Reference" (1st image).
      
      MANDATORY CONSTRAINTS (100% FIDELITY):
      1. ANATOMICAL POSE: The character MUST be in the IDENTICAL anatomical pose as the 2nd image. Every finger, the lean of the head, and the shoulder position must match pixel-for-pixel. If the person in the meme is pointing at their temple, the output character MUST point at their temple at the exact same angle.
      2. COMPOSITION & FRAMING: The camera distance, angle, and framing must be IDENTICAL to the 2nd image. 
      3. LIGHTING & COLOR: The lighting direction, intensity, and color palette MUST match the 2nd image exactly. If the 2nd image is bright daylight, the output must be bright daylight.
      4. CHARACTER IDENTITY: Extract ONLY the facial features, hair style, hair color, and skin tone from the 1st image. Apply these onto the person's structure in the 2nd image.
      5. BACKGROUND: The background must be a direct high-quality recreation of the background in the 2nd image.
      
      ZERO CREATIVITY ALLOWED regarding pose and composition. This is a structural replacement task.
      Quality: 8k resolution, photorealistic, masterpiece.
      No borders, no frames.
    `;

    const imagenModelName = process.env.IMAGEN_MODEL || "gemini-3.1-flash-image-preview";
    const model = genAI.getGenerativeModel({ model: imagenModelName });
    
    // Prepare multi-modal content
    // We'll send the prompt and both images.
    const contentParts = [
      { text: prompt },
      {
        inlineData: {
          data: characterImage.split(',')[1],
          mimeType: "image/jpeg"
        }
      },
      {
        inlineData: {
          data: memeImage.split(',')[1],
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
