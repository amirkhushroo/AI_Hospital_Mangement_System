const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeSymptoms = async (symptoms) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const cleanedSymptoms = symptoms.trim();

    const prompt = `
You are an experienced medical AI assistant.

Analyze the patient's symptoms carefully and return ONLY a valid JSON object.

Patient Symptoms:
${cleanedSymptoms}

Rules:
1. Return ONLY valid JSON.
2. Do NOT return markdown.
3. Do NOT use \`\`\`json or \`\`\`.
4. Do NOT explain anything.
5. Every field must be present.
6. Arrays must always be arrays, even if empty.

JSON Format:

{
  "possibleDisease": "",
  "confidence": "",
  "severity": "",
  "recommendedDoctor": "",
  "medicines": [],
  "homeRemedies": [],
  "diet": [],
  "testsRecommended": [],
  "precautions": [],
  "emergency": false,
  "emergencyMessage": "",
  "disclaimer": "This AI analysis is for informational purposes only. Please consult a qualified doctor for medical advice."
}

Severity must be one of:
Low
Moderate
High
Critical

Confidence example:
90%

Emergency must be:
true
false
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let result = response.text;

    if (!result) {
      throw new Error("Empty response received from Gemini.");
    }

    // Remove accidental Markdown formatting
    result = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return result;
  } catch (error) {
    console.error("Gemini Service Error:", error);

    throw new Error("Failed to analyze symptoms using AI.");
  }
};

module.exports = {
  analyzeSymptoms,
};