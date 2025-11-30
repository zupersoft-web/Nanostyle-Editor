import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Sends an image and a text prompt to Gemini to generate an edited version.
 */
export const editImageWithGemini = async (
  base64Data: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
        ],
      },
      // Config for image generation if needed, though default usually works well for editing
      config: {
        // We do not set responseMimeType for image generation models
      }
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content returned from Gemini.");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        // Construct the data URL for the frontend to display
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }

    // If no image part found, check if there is text explaining why (sometimes the model refuses)
    const textPart = parts.find(p => p.text);
    if (textPart && textPart.text) {
      throw new Error(`Model returned text instead of image: ${textPart.text}`);
    }

    throw new Error("The model did not return a valid image.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to edit image.");
  }
};

/**
 * Helper to convert a File object to a raw Base64 string (without data URL prefix).
 */
export const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Split "data:image/jpeg;base64,..."
      const match = result.match(/^data:(.+);base64,(.*)$/);
      if (match) {
        resolve({
          mimeType: match[1],
          base64: match[2],
        });
      } else {
        reject(new Error("Failed to parse base64 data."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};