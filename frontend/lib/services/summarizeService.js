import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const summarizeResults = async (caption, results) => {
  try {
    if (!results || results.length === 0) {
      return "No useful Google results available to summarize.";
    }

    const context = `Caption: ${caption}\n\nSearch Results:\n${results.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}`;
    
    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: `Summarize the following product information into a short informative paragraph:\n\n${context}`
        }
      ],
      max_tokens: 250,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Groq summarization error:', error);
    return "Failed to generate summary.";
  }
};
