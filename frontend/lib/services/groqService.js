import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const getCaption = async (imageUrl) => {
  try {
    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageUrl }
            },
            {
              type: "text",
              text: "This is a product image. Describe what you see in 1-2 short sentences. Focus on: product type, brand name if visible, color, and key features like SPF or ingredients. Be specific and concise — this description will be used as a search query."
            }
          ]
        }
      ],
      max_tokens: 200,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Groq captioning error:', error);
    throw error;
  }
};
