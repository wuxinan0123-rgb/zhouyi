import { GoogleGenAI } from "@google/genai";
import { HexagramData } from "../types";
import { TRIGRAMS } from "../constants";

export const streamHexagramInterpretation = async (
  hexagram: HexagramData,
  onChunk: (text: string) => void
) => {
  // Fix: Use process.env.API_KEY directly as per guidelines
  if (!process.env.API_KEY) {
    onChunk("API Key is missing. Please configure the environment variable.");
    return;
  }

  // Fix: Initialize with process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Derive structure
  const lowerKey = hexagram.symbol.slice(0, 3).join(',');
  const upperKey = hexagram.symbol.slice(3, 6).join(',');
  const lowerTri = TRIGRAMS[lowerKey];
  const upperTri = TRIGRAMS[upperKey];

  const compositionText = lowerTri && upperTri 
    ? `Composition: Upper ${upperTri.name} (${upperTri.nature}) over Lower ${lowerTri.name} (${lowerTri.nature}).`
    : '';

  // Create a string representation of the lines for the AI (Bottom to Top)
  // 1 = Yang (Nine), 0 = Yin (Six)
  const lineStructure = hexagram.symbol.map((val, index) => 
    `Line ${index + 1}: ${val === 1 ? 'Yang (Nine)' : 'Yin (Six)'}`
  ).join('\n      ');

  try {
    const prompt = `
      You are a wise and profound I Ching master.
      Please provide a detailed bilingual (Chinese and English) interpretation for the following Hexagram.
      
      Name: ${hexagram.name} (${hexagram.english})
      Pinyin: ${hexagram.pinyin}
      Number: ${hexagram.id}
      ${compositionText}
      Structure (Bottom to Top):
      ${lineStructure}

      Structure your response nicely using Markdown headers. 
      **Crucial:** For each section, write the content in **Chinese** first, followed immediately by the **English** translation.
      
      Required Sections:
      1. **The Essence / 核心卦义**: A brief poetic summary of the hexagram's meaning.
      2. **The Judgment / 卦辞解析**: Explanation of the core judgment.
      3. **The Image / 大象传**: Symbolism of the trigrams (e.g., Mountain over Wind).
      4. **The Lines / 爻辞详解**: 
         - Iterate through all 6 lines from **Bottom (Line 1)** to **Top (Line 6)**.
         - For each line, clearly state the position (e.g., "Initial Nine", "Six in the second place").
         - Provide the traditional meaning and a modern annotation for that specific line.
      5. **Modern Guidance / 现代启示**: Practical advice for career, relationships, or decision making.

      Keep the tone serene, philosophical, yet clear and helpful. Use bolding for key terms.
    `;

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
    });

    for await (const chunk of response) {
      const text = chunk.text;
      if (text) {
        onChunk(text);
      }
    }
  } catch (error) {
    console.error("Error generating interpretation:", error);
    onChunk("\n\n[The oracle is silent. Please check your connection and try again.]");
  }
};