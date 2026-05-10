import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SBTI_TYPES } from '@/lib/sbti-data';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { sbtiId, characterImage, characterName, genType } = await req.json();

    const type = SBTI_TYPES.find(t => t.id === sbtiId);
    if (!type) {
      return NextResponse.json({ error: 'Invalid SBTI type' }, { status: 400 });
    }

    const imageData = characterImage ? characterImage.split(',')[1] : null;

    let finalImagePrompt = '';
    
    if (genType === 'CardBack') {
      finalImagePrompt = `
        Please generate a "Mystical Card Back" illustration for the SBTI type "${type.id}".
        
        Core Subject: A silhouette of the person from the attached photo, rendered as a dark shadow silhouette.
        
        Design Elements:
        - Silhouette Detail: Inside the silhouette, show a beautiful swirling galaxy with stars and nebulae in colors matching ${type.color}.
        - Card Frame: Surround the silhouette with an intricate, magical celestial card frame (gold and silver ornate patterns, zodiac symbols, gears, and moons).
        - Typography: In the center of the silhouette, the text "${type.id}?" should be written in an elegant, glowing serif mystical font.
        - Style: High-fantasy mystical card game art style, glowing with magical light and cosmic energy.
        - Color Palette: Dominated by ${type.color} and deep cosmic purples/blacks.
        
        Background: Intricate celestial patterns and a magical aura.
        
        Quality: Masterpiece, ultra-detailed, clean lines, professional digital illustration.
        Vertical card layout.
        
        Absolutely NO other text except "${type.id}?".
      `;
    } else {
      finalImagePrompt = `
        Please generate a super cute Chibi anime character based on the attached photo.
        
        Character Identity: You MUST capture the facial likeness, hair style, and hair color of the person in the attached photo, but rendered in a cute Chibi anime style.
        
        SBTI Type Concept (${type.nameEn}):
        - Costume: The character MUST be ${type.outfit}
        - Pose: The character should be ${type.pose}
        - Atmosphere/Vibe: ${type.trait}.
        - Character Theme: This character represents the "${type.nameEn}" (${type.nameTh}) personality.
        
        Design Concept:
        - Style: Ultra-cute Chibi style (large expressive eyes, small adorable body, slightly oversized head).
        - Aesthetic: Modern cute anime style with soft vibrant ${type.color} accents.
        - Rendering: Magical sparkling kawaii illustration, soft dreamy gradients, high quality digital art.
        - Quality: Masterpiece, highly detailed, clean lineart.
        
        Absolutely NO borders, NO frames, and NO text in the illustration.
        Vertical portrait layout.
      `;
    }

    const imagenModelName = process.env.IMAGEN_MODEL || "gemini-3.1-flash-image-preview";
    const model = genAI.getGenerativeModel({ model: imagenModelName });
    
    let result;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        if (imageData) {
          result = await model.generateContent([
            finalImagePrompt,
            {
              inlineData: {
                data: imageData,
                mimeType: "image/jpeg"
              }
            }
          ]);
        } else {
          result = await model.generateContent([finalImagePrompt]);
        }
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
