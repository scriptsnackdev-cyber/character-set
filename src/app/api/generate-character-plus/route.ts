import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { fatherImage, motherImage, age, gender, theme, additionalDetails } = await req.json();

    if (!fatherImage || !motherImage) {
      return Response.json({ error: 'Please upload both Father and Mother images' }, { status: 400 });
    }

    const prompt = `
      TASK: Generate a child character that is the genetic offspring of the FATHER (Photo 1) and MOTHER (Photo 2).
      
      CORE REQUIREMENT (MAXIMUM LIKENESS):
      - The child MUST inherit recognizable traits from BOTH parents.
      - HAIR: Blend Mother's hair color/texture with Father's hair style (or vice versa).
      - EYES: Use an exact blend of the parents' eye shapes and colors.
      - FACE: Inherit the facial structure, skin tone, and overall 'vibe' of both parents.
      - This should not be a generic child; it must look like their biological kid.
      
      ART STYLE REPLICATION (IDENTICAL MATCH):
      - You MUST analyze and replicate the EXACT art style of the parents.
      - Lineart: Match the thickness and color of the lines (e.g., if they have soft brown lines, use soft brown lines).
      - Shading: Match the shading technique (cell shading, soft painting, watercolor, etc.).
      - Color Palette: Use colors sampled directly from the parents' images for the child's features.
      - Proportions: If parents are Chibi, the child MUST be Chibi. If they are 8-head tall anime, the child MUST be anime proportions suitable for their age.
      
      CHARACTER DETAILS:
      - Age: ${age || '7 years old'}. Ensure the character's height and facial maturity match this age.
      - Gender: ${gender || 'undetermined, natural blend'}.
      ${additionalDetails ? `- User's Special Requests: ${additionalDetails}` : ''}
      
      COMPOSITION:
      - Vertical portrait.
      - Background: Minimalist or matching the parents' background style.
      - Quality: Masterpiece, ultra-high resolution, professional digital illustration.
      
      NO text, NO borders, NO watermarks.
    `;

    const imagenModelName = process.env.IMAGEN_MODEL || "gemini-3.1-flash-image-preview";
    const model = genAI.getGenerativeModel({ model: imagenModelName });
    
    // Prepare multi-modal content
    const contentParts: any[] = [
      prompt,
      {
        inlineData: {
          data: fatherImage.split(',')[1],
          mimeType: "image/jpeg"
        }
      },
      {
        inlineData: {
          data: motherImage.split(',')[1],
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
    console.error('Character+ Generation Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
