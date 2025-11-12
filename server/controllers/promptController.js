const MODEL_NAME = "gemini-2.0-flash";

const promptEnhancing = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt required" });

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      throw new Error("GEMINI_API_KEY not configured in environment");
    }

    const newPrompt = `Rewrite this into a detailed, cinematic, high-quality AI image prompt: "${prompt}"`;

    const payload = {
      contents: [
        {
          parts: [{ text: newPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
      },
    };

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error("No response content from Gemini");
    }
    console.log(JSON.parse(responseText.trim()));

    return res.json({
      enhancedPrompt: JSON.parse(responseText.trim())[0].prompt,
    });
  } catch (error) {
    const fallback = `${prompt}, ultra-realistic, cinematic lighting, 4K, detailed textures`;
    res.json({ enhancedPrompt: fallback });
  }
};

export { promptEnhancing };
