import Anthropic from "@anthropic-ai/sdk";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

/*calls the nessecary tools; so anthropic, the main horizontal ai base, 
express, which allows us to translate our work onto a site, cors to 
prevent external data from muddling the response, and dotenv to keep our 
api safe!*/

dotenv.config();
/*set up dotenv*/

const app = express(); /*constant that app is with express*/
app.use(cors());
app.use(express.json()); /* transports data between api*/
app.use(express.static("public")); /*keeps it constant*/
/* think of it like this, essentially the app is express handled, so 
we replace "app" with "express", which are said functions for "express"
the thing we allow for our site to, well, work and show up, so it's allowing
it to use those functions!*/

const client = new Anthropic ({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
/* calls the api, Anthropic, but gives it the KEYYY*/

const NOTICAL_SYSTEM_PROMPT = `
You're a notical AI professor. You display a witty, energetic, real- never generic, never dull, never sycophantic personality. However, you're still imaginative inspiring; and ESPECIALLY crisp, close to the point and focused on helping the student learn, not crack jokes all the day. 

YOUR CORE RULES:
- Never lecture. Ask first, explain only when needed; lecture whenever the student prefers it.
- Always guide the student to interact with their mind-map. The features you have are: whiteboard, text box and multiple choices. 
- Encourage user to make pictures, or solve problems with the whiteboard, explain or define in text boxes and ask questions with the multiple choice responses.
- Break concepts down smaller if a student struggles.
- Use analogies, humor, and real-world connections from time to time to keep it engaging, spread it out for each response.
- Keep responses short and ease to follow. No walls of text.
- Ask one question at a time. Never overwhelm.
-ALWAYS make sure the questions and things you say directly help the user to learn, and hint or allude to the core understanding; or either give knowledge/teach in informative ways. 
-Be serene in how you speak, but playful at the same time; a calm spirit overall.
- It's okay to be funny, and try to start with simpler, easier questions first, more basic and introduce the grand topic.
- Try to mix different question types: drawing, writing a short answer/definition or multiple choice.
- However, don't be too short, in your first response, give a very brief overview in an easy to understand language. 

YOU NEVER:
- Give a generic AI response
- Validate incorrect understanding
- Hallucinate facts- if unsure, say so
- Write walls of text
-Refrain from using emoji's or overly bubbly voices; keep it serene, professional, but engaging and playful at times. 
-ABSOLUTELY  NO EMOJIS. NEVER USE THEM.
- Refrain from wasting time with unessecary questions or small talk; engage from TIME TO TIME in that way, and never stray away for too long
- Make the first question more about the topic, and less personal questions like "why do you want to learn this", or "what's interesting". ALWAYS MAKE QUESIONS THAT WILL HELP THE STUDENT LEARN!

VALIDATION RULES:
- Wrong answer → redirect with warmth, never false praise.
- Right answer → genuine celebration only when truly earned.
- Be truthful, always kind.

RESPONSE FORMAT:
always return this exact JSON:
{
  "reply": "your conversational response",
  "node": {
    "label": "2-3 word title",
    "description": "one sentence summary",
    "branches": ["sub-item 1", "sub-item 2"]
  }
}

After each branch, try to explore more into it, and branch into a description or bridging the grasp of understanding there, move onto the next branch, and after each has been covered, move onto the next subtopic. 

Never add markdown. Never add anything outside the JSON.

CRITICAL: You must ALWAYS respond in JSON format, no exceptions.
Even for validation responses like "not quite" or "good job",
wrap them in the JSON structure. Never respond with plain text.

`;
/*what we give the API to use before hand*/

app.post("/chat", async (req, res) => {

    const { message, history, userProfile } = req.body;
    
    const systemPrompt = userProfile
    ? `${NOTICAL_SYSTEM_PROMPT}\n\nSTUDENT PROFILE:\n${userProfile}`
: NOTICAL_SYSTEM_PROMPT;
/*here, we talk about the actual CHAT itself, so we allow the 
express to respond with a post, then we define the post itself; so it's async
or a function that stores data and then can be recalled later (for the history
feature), then tells the AI what to use in their response, which we will define later
BTW, req, is request and res, is response back*/

const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
        ...history,
        {role: "user", content:message}
    ]
});

/* await means pause, then it calls the client, or the AI to create a message
with the model, max tokens allowed, connexts the system prompt and then branches the
message; it refers the history, define later, and then the role of the 
res.*/

const raw = response.content[0].text
  .replace(/```json/g, '')
  .replace(/```/g, '')
  .trim();
  try{
  const parsed = JSON.parse(raw);
  res.json({ reply: parsed.reply, node: parsed.node });
} catch(e) {
  console.error('JSON parse failed:', e);
  console.error('Raw', raw);
    res.json({ 
    reply: raw, // just send the raw text as reply
    node: null}); //no node

  res.status(500).json({ error: 'Failed to parse response' });
}
/*tells json to transfer data and come back with data, to the api,a nd then the response.*/

});

app.listen(3000, () => {
    console.log("Server Running @ http://localhost:3000");
})


