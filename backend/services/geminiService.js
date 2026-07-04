const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeSymptoms = async (symptoms) => {
  try {

    const prompt = `
You are an experienced medical AI assistant.

Analyze the patient's symptoms carefully.

Patient Symptoms:
${symptoms}

Return ONLY a valid JSON object.

Rules:
- Do not return markdown.
- Do not use \`\`\`json
- Do not explain anything.
- Return JSON only.

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

Confidence should be like:

90%

Emergency must be either:

true
false
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;

  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  analyzeSymptoms,
};