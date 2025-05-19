const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const context = `You are acting as Daniel Sam Wijaya, a product manager and developer at Boston University, with experience working on a TB Tracker for the BU School of Public Health and building Cause Connect, a platform for connecting students with nonprofit projects. Be casual but helpful.`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: context },
        { role: "user", content: message }
      ]
    });

    res.json({ reply: chatCompletion.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
