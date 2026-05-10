import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with the key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { characterImage, cardType } = await req.json();

    if (!characterImage || !cardType) {
      return NextResponse.json({ error: 'Missing character image or card type' }, { status: 400 });
    }

    const imageData = characterImage.split(',')[1]; // Remove base64 prefix
    
    let finalImagePrompt = '';
    
    if (cardType === 'Card Back') {
      finalImagePrompt = `
        Please generate a professional and mystical Tarot card back design based on the aesthetic, colors, and vibe of the person in the attached photo.
        
        Design Concept:
        - A symmetrical, ornate, and intricate pattern suitable for the back of a premium tarot deck.
        - The design should incorporate elements that reflect the person's style (colors, motifs, and energy) from the photo.
        - Central motif could be a mystical symbol (like a compass, mandala, or celestial element) that resonates with the character's aesthetic.
        - The color palette should be derived from the attached photo (e.g., if they wear blue, use deep blues and golds).
        
        Art Style:
        - Modern cute anime style with soft vibrant pastel accents.
        - Magical sparkling kawaii illustration, soft dreamy gradients.
        - High quality digital art, clean lineart, soft shading, glassmorphism elements.
        - Symmetrical and balanced composition.
        
        Absolutely NO borders, NO frames, and NO text in the illustration itself.
        Vertical portrait layout.
      `;
    } else {
      finalImagePrompt = `
        Please generate an image based on the attached photo of this person representing the tarot card "${cardType}".
        
        Character Identity: You MUST perfectly capture the exact facial likeness and identity of the person in the attached photo. Maintain their exact gender, facial features, hair style, and hair color.
        
        Theme: The Tarot card "${cardType}". The mood should be magical, confident, and expressive.
        Clothing: Dress them in an outfit that perfectly matches the theme, symbolism, and appropriateness of "${cardType}". Do NOT just copy their original clothes.
        Pose: A magical and expressive pose that represents the archetype of "${cardType}".
        
        Art Style & Rendering:
        Modern cute anime style, soft vibrant pastel aesthetic, magical sparkling kawaii illustration, similar to modern magical girl themes.
        Dreamy pastel gradients, soft glowing stars, cute magical aura. High quality digital art, clean lineart, soft shading, glassmorphism elements.
        Masterpiece, highly detailed, high resolution. Vertical portrait layout.
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
        if (attempt === 2) throw new Error(`Imagen API Error (1-Step): ${err.message}`);
        console.log(`Imagen attempt ${attempt} failed, retrying...`);
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    if (!result) {
        throw new Error("Failed to receive a result from Imagen after retries.");
    }
    
    // 4. Extract generated image from output
    let imageUrl = "";
    
    try {
      const response = result.response;
      const candidates = response.candidates;
      
      if (candidates && candidates.length > 0 && candidates[0].content && candidates[0].content.parts) {
        const parts = candidates[0].content.parts;
        // Look for the part that contains the image data
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
      throw new Error("Model failed to generate an image. Please check your model configuration in .env.");
    }
    
    return NextResponse.json({ 
      success: true, 
      prompt: finalImagePrompt,
      imageUrl: imageUrl
    });

  } catch (error: any) {
    console.error('Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
