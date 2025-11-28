import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const { prompt, history } = req.body;

  if (!prompt) return res.status(400).json({ reply: "Prompt kosong" });

  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // set di Vercel Dashboard

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        input: prompt,
        conversation: history || []
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.output_text || "Tidak ada respon dari API" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error server: " + err.message });
  }
}