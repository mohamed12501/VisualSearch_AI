import { getJson } from 'serpapi';

export const googleResearch = async (query) => {
  try {
    const response = await getJson({
      engine: 'google',
      q: query,
      api_key: process.env.SERPAPI_KEY,
    });

    if (!response.organic_results) {
      return [];
    }

    return response.organic_results.slice(0, 5).map(result => ({
      title: result.title,
      snippet: result.snippet,
      link: result.link,
      displayed_link: result.displayed_link,
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(result.link).hostname}&sz=32`
    }));
  } catch (error) {
    console.error('SerpAPI error:', error);
    return [];
  }
};
