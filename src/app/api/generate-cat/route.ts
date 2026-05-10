import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CAT_BREEDS } from '@/lib/cat-data';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { breedId, characterImage, characterName } = await req.json();

    const breed = CAT_BREEDS.find(b => b.id === breedId);
    if (!breed) {
      return NextResponse.json({ error: 'Invalid cat breed' }, { status: 400 });
    }

    const imageData = characterImage ? characterImage.split(',')[1] : null;

    const finalImagePrompt = `
      Please generate a super cute Chibi anime character based on the attached photo, wearing a costume of a ${breed.nameEn} cat.
      
      Character Identity: You MUST capture the facial likeness, hair style, and hair color of the person in the attached photo, but rendered in a cute Chibi anime style.
      
      Costume Concept:
      - The character MUST be wearing a full cat-themed outfit representing a ${breed.nameEn} (${breed.nameTh}).
      - Outfit Features: ${breed.traits.join(', ')}. For example, if it's a ${breed.nameEn}, include its ${breed.traits[0]} and ${breed.traits[1]}.
      - The outfit should be a cozy onesie or a stylish cat-eared hoodie with a tail and paws.
      
      Design Concept:
      - Style: Ultra-cute Chibi style (large expressive eyes, small adorable body, slightly oversized head).
      - Aesthetic: Modern cute anime style with soft vibrant pastel accents.
      - Rendering: Magical sparkling kawaii illustration, soft dreamy gradients, high quality digital art.
      - Quality: Masterpiece, highly detailed, clean lineart, soft shading, glassmorphism elements.
      
      Absolutely NO borders, NO frames, and NO text in the illustration.
      Vertical portrait layout.
    `;

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
