import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const extractSearchQuery = async (caption) => {
  try {
    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: `Extract a short Google search query (3-6 words max) from this product description. Return ONLY the query, nothing else.\n\nDescription: ${caption}`
        }
      ],
      max_tokens: 30,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Groq query extraction error:', error);
    return caption; // fallback
  }
};
