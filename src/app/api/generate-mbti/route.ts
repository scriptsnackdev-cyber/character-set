import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with the key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { characterImage, mbtiType, characterName, houseColor, houseColorName, genType } = await req.json();

    if (!characterImage || !mbtiType) {
      return NextResponse.json({ error: 'Missing character image or MBTI type' }, { status: 400 });
    }

    const imageData = characterImage.split(',')[1]; // Remove base64 prefix
    
    let finalImagePrompt = '';

    if (genType === 'CardBack') {
      finalImagePrompt = `
        Please generate a professional and mystical MBTI card back design based on the attached photo and the personality type "${mbtiType}".
        
        Design Concept:
        - Central Motif: A mysterious, glowing silhouette/shadow of the person from the attached photo.
        - Text Element: Include the text "${mbtiType}?" in a stylish, magical font as part of the central design.
        - Aesthetic: Symmetrical, ornate, and intricate pattern suitable for a premium card back.
        - Color Palette: Dominant use of ${houseColorName || 'purple'} (the house color) with gold or silver accents.
        - Vibe: Mysterious, mystical, and high-end.
        
        Art Style:
        - Modern cute anime style with soft vibrant pastel accents.
        - Magical sparkling kawaii illustration, soft dreamy gradients.
        - High quality digital art, clean lineart, soft shading, glassmorphism elements.
        
        Absolutely NO borders, NO frames, and NO other text in the illustration itself except for "${mbtiType}?".
        Vertical portrait layout.
      `;
    } else {
      finalImagePrompt = `
        Please generate a cute Chibi anime character based on the attached photo, representing the MBTI type "${mbtiType}".
        
        Character Identity: You MUST perfectly capture the facial likeness, hair style, and hair color of the person in the attached photo, but rendered in a cute Chibi anime style.
        
        Concept:
        - Style: Chibi anime style (large head, small body, big expressive eyes, extremely cute).
        - Outfit: The character MUST be wearing a cute cat-themed outfit (e.g., a cat ear hoodie, cat paws, a cat tail, or a full cat onesie).
        - Outfit Color: The cat outfit should be primarily ${houseColorName || 'pastel'} in color (matching the ${mbtiType} house color).
        - MBTI Theme: Incorporate traits and elements of the "${mbtiType}" personality type into the character's expression, pose, and accessories.
        
        Art Style & Rendering:
        - Modern cute anime style, soft vibrant pastel aesthetic.
        - Magical sparkling kawaii illustration, soft dreamy gradients.
        - High quality digital art, clean lineart, soft shading, glassmorphism elements.
        - Masterpiece, highly detailed, high resolution. Vertical portrait layout.
        
        Absolutely NO borders, NO frames, and NO text in the illustration itself.
      `;
    }

    // Generate Image directly (1-Step)
    const imagenModelName = process.env.IMAGEN_MODEL || "gemini-3.1-flash-image-preview";
    const model = genAI.getGenerativeModel({ model: imagenModelName });
    
    let result;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        result = await model.generateContent([
          finalImagePrompt,
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
    
    // Extract generated image from output
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
