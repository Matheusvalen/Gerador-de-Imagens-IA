
import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImageFromPrompt = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("Nenhuma imagem foi gerada. A resposta da API estava vazia.");
    }
  } catch (error) {
    console.error("Erro ao gerar imagem com a API Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Falha na geração da imagem: ${error.message}`);
    }
    throw new Error("Ocorreu um erro desconhecido ao gerar a imagem.");
  }
};
