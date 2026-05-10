import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { characterImage, outfitImage, additionalRequests } = await req.json();

    if (!characterImage || !outfitImage) {
      return Response.json({ error: 'Please upload both character and outfit images' }, { status: 400 });
    }

    const prompt = `
      CRITICAL TASK: DYNAMIC OUTFIT ADAPTATION (PHYSICS-BASED VIRTUAL TRY-ON)
      
      I have attached two images:
      1. BASE IMAGE (Character + Background + Pose): The person, their pose, and the background environment.
      2. OUTFIT REFERENCE: The clothing style, textures, colors, and logos to be transferred.
      
      STRICT REQUIREMENTS FOR CHARACTER & ENVIRONMENT:
      - 100% SAME POSE: Keep the character's body position, limb angles, and posture IDENTICAL to the BASE IMAGE.
      - 100% SAME FACE: Keep the character's face, hair, and expression IDENTICAL to the BASE IMAGE.
      - 100% SAME BACKGROUND: Keep the exact background and lighting from the BASE IMAGE.
      
      OUTFIT ADAPTATION RULES (IMPORTANT):
      - DO NOT force the rigid shape or silhouette from the OUTFIT REFERENCE onto the character.
      - DYNAMIC DRAPING: The clothing must drape, fold, and wrinkle NATURALLY according to the character's specific pose and body shape in the BASE IMAGE.
      - LOGOS & DETAILS: Faithfully transfer key details like the "KMITL" text on the pocket and the gear necklace, but ensure they follow the curves and folds of the fabric as it sits on the character's body.
      - TEXTURE & FABRIC: Match the material (e.g., cotton, silk, denim) and lighting of the outfit to the environment of the BASE IMAGE.
      
      ADDITIONAL REQUESTS: ${additionalRequests || 'None.'}
      
      The result should look like the person in the BASE IMAGE just happened to be wearing the clothes from the OUTFIT REFERENCE, with realistic fabric physics and natural integration.
    `;

    const imagenModelName = process.env.IMAGEN_MODEL || "gemini-3.1-flash-image-preview";
    const model = genAI.getGenerativeModel({ model: imagenModelName });
    
    // Prepare multi-modal content
    const contentParts: any[] = [
      prompt,
      {
        inlineData: {
          data: characterImage.split(',')[1],
          mimeType: "image/jpeg"
        }
      },
      {
        inlineData: {
          data: outfitImage.split(',')[1],
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
    console.error('PureWare Generation Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
