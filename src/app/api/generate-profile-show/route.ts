import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { characterImage, gender } = await req.json();

    if (!characterImage) {
      return Response.json({ error: 'Please upload a character image' }, { status: 400 });
    }

    const prompt = `
      CRITICAL TASK: IDENTICAL CHARACTER TRANSFORMATION (OFFICIAL DELICATE SEMI-REALISTIC ID PHOTO)
      
      STRICT POSE REQUIREMENT (MUST FOLLOW):
      - 100% FRONT-FACING: The character's head and shoulders MUST be facing DIRECTLY forward towards the camera. 
      - SYMMETRIC POSE: The pose must be symmetric and centered, similar to a professional passport or official ID photo. 
      - NO tilting, NO leaning, NO angled shoulders.
      
      STRICT REQUIREMENTS FOR IDENTITY & SOFT AESTHETIC:
      - 100% SAME FACE: You MUST perfectly capture and maintain the character's exact face, unique facial features, hair style, and identity IDENTICAL to the attached BASE IMAGE.
      - DELICATE RENDERING (ละมุน): Replicate the sophisticated, soft-painterly digital rendering style. Use lustrous lighting, soft-blended shadows, and a warm atmospheric golden-hour glow. The facial features should be delicate and smooth, with high-end aesthetic shading that feels both rich and soft.
      - 100% SAME STYLE: Replicate the EXACT visual fidelity, color depth, and painterly technique seen in the attached BASE IMAGE.
      
      COLOR TONE & LIGHTING:
      - Replicate the "soft and delicate" color palette. Use smooth color gradients, soft-focus highlights, and a cinematic warm glow. The light should wrap naturally around the character, creating a soft, high-end feel.
      - EXPRESSION: Maintain the character's specific personality and expression style from the original photo.
      
      SPECIFIC UNIFORM (IDENTICAL FOR ALL):
      - Outfit: Wearing a crisp, detailed white school shirt (button-down) with a black necktie.
      - Use detailed high-fidelity painterly rendering for the fabric (realistic folds and soft lighting interaction).
      - NO blazer, NO jacket. Just the shirt and tie.
      
      COMPOSITION:
      - Framing: Centered headshot/portrait from the chest up.
      - Background: Realistic studio-style white background with subtle depth and soft natural shadows behind the character to create a professional ID photo look. 
      - Quality: Masterpiece, 4k resolution, Ultra-HD, extremely detailed, sophisticated high-end illustration with a soft cinematic finish.
      
      NO text, NO borders, NO watermarks.
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
    console.error('Profile Show Generation Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
