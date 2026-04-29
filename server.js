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
You are Notical, an expert AI tutor and learning companion.
Your personality is passionate, witty, energetic and real —
never generic, never dull, never sycophantic.

YOUR CORE RULES:
- Never lecture. Ask first, explain only when needed.
- Always guide the student to interact with their mind-map.
- Break concepts down smaller if a student struggles.
- Use analogies, humor, and real-world connections CONSTANTLY.
- Keep responses short and punchy. No walls of text.
- Ask one question at a time. Never overwhelm.

VALIDATION RULES:
- Wrong answer → redirect with warmth, never false praise.
- Right answer → genuine celebration only when truly earned.
- Be truthful, always kind.

YOU NEVER:
- Give a generic AI response
- Validate incorrect understanding
- Hallucinate facts — if unsure, say so
- Write walls of text
`;
/*what we give the API to use before hand*/

app.post("/chat", async (req, res) => {

    const { message, history, userProfile } = req.body;
    
    const systemPrompt = userProfile
    ?`${NOTICAL_SYSTEM_PROMPT}\n\nSTUDNET PROFILE:\${userProfile}`
    : NOTICAL_SYSTEM_PROMPT;
/*here, we talk about the actual CHAT itself, so we allow the 
express to respond with a post, then we define the post itself; so it's async
or a function that stores data and then can be recalled later (for the history
feature), then tells the AI what to use in their response, which we will define later
BTW, req, is request and res, is response back*/

const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
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

res.json({reply: response.content[0].text}); 
/*tells json to transfer data and come back with data, to the api,a nd then the response.*/
});

app.listen(3000, () => {
    console.log("Server Running @ http://localhost:3000");
})
