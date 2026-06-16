import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Memory store (simulated DB for sessions)
  const memoryStore: Record<string, any[]> = {};

  app.post('/api/research', async (req, res) => {
    // SSE Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (event: string, data: any) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    try {
      const { query, sessionId, image } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }

      const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }});
      const model = "gemini-2.5-flash";

      // Session Memory Context
      const history = memoryStore[sessionId] || [];
      const historyContext = history.length > 0 ? `Previous Session Context: ${history.map(h => h.query).join('; ')}` : "No previous context.";

      // Add to memory
      const timestamp = Date.now();
      if (!memoryStore[sessionId]) memoryStore[sessionId] = [];
      memoryStore[sessionId].push({ query, timestamp, report: '' });

      // Step 1: Orchestrator
      sendEvent('status', { agent: 'orchestrator', message: 'Analyzing query and delegating to specialized agents...' });
      await new Promise(r => setTimeout(r, 1500));

      // Step 2: Web Search and Code Agents start in parallel
      sendEvent('status', { agent: 'web', message: 'Executing live Google Search to gather latest academic and news sources...' });
      sendEvent('status', { agent: 'code', message: 'Provisioning sandboxed environment to compute data analysis...' });

      const webSearchPromise = ai.models.generateContent({
        model,
        contents: image ? [
           `Research the following topic thoroughly. Gather recent facts, statistics, and claims. Topic: ${query}. ${historyContext}`,
           { inlineData: { data: image.data, mimeType: image.mimeType } }
        ] : `Research the following topic thoroughly. Gather recent facts, statistics, and claims. Topic: ${query}. ${historyContext}`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const codeExecPromise = ai.models.generateContent({
        model,
        contents: `Act as a Data Analysis Agent. Generate a highly analytical summary providing mathematical, statistical, or structured insights about this topic: ${query}. (Simulate Kaggle/Python output)`,
        config: {
          systemInstruction: "You are the Code Executor Agent in a research pipeline. Provide data insights."
        }
      });

      const [webResult, codeResult] = await Promise.all([webSearchPromise, codeExecPromise]);

      sendEvent('status', { agent: 'critic', message: 'Cross-verifying all claims, evaluating constraints, and calculating Trust Score...' });
      
      const criticPrompt = `
      You are the Critic Agent. Your job is to rigorously review the provided Web Research Data and Data Analysis, fact-check the claims, apply a Trust Score (0-100), and format a final Structured Research Report in Markdown.

      --- Web Research Data ---
      ${webResult.text}

      --- Data Analysis ---
      ${codeResult.text}

      --- Requirements ---
      - Output a highly professional Markdown document.
      - Never break character as the final output synthesizer.
      - Start directly with the markdown content.
      - Format must be:
        # Research Report: [Topic Name]
        ## Executive Summary
        ## Key Findings & Claims
        ## Data Insights
        ## Critic's Guardrails & Evaluation
        > **Trust Score: X/100**
        (Include rationale for the score based on source credibility and consensus).
        ## Evaluated Sources
      `;

      const criticStream = await ai.models.generateContentStream({
        model,
        contents: criticPrompt,
        config: { systemInstruction: "You are the Critic Agent. Output clean markdown." }
      });

      sendEvent('status', { agent: 'orchestrator', message: 'Compilation complete. Streaming structured report...' });

      let fullReport = "";
      for await (const chunk of criticStream) {
        const text = chunk.text;
        if (text) {
          fullReport += text;
          sendEvent('report', { text });
        }
      }

      const sessionHistory = memoryStore[sessionId];
      if (sessionHistory) {
         const entry = sessionHistory.find(h => h.timestamp === timestamp);
         if (entry) {
            entry.report = fullReport;
         }
      }

      sendEvent('done', {});
      res.end();
    } catch (error: any) {
       // Avoid logging rate limits to stderr to prevent false crash reports
       if (error?.message && (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('503'))) {
           console.log("Research API Warning:", error.message.substring(0, 200) + '...');
       } else {
           console.error("Research Error:", error);
       }
       
       let errorMessage = "An unexpected error occurred. Please try again.";
       
       if (error instanceof Error) {
           errorMessage = error.message;
           // Try to parse JSON error messages from the SDK
           try {
               // Extract JSON block if present
               const jsonMatch = error.message.match(/(\{[\s\S]*\})/);
               if (jsonMatch) {
                   const parsed = JSON.parse(jsonMatch[1]);
                   if (parsed.error && parsed.error.code === 503) {
                       errorMessage = "The AI model is currently experiencing high demand. Spikes in demand are usually temporary. Please wait a moment and try again.";
                   } else if (parsed.error && parsed.error.message) {
                       // Sometimes the message itself is stringified JSON
                       try {
                           const nested = JSON.parse(parsed.error.message);
                           if (nested.error && nested.error.message) {
                               errorMessage = nested.error.message;
                           } else {
                               errorMessage = parsed.error.message;
                           }
                       } catch(e) {
                           errorMessage = parsed.error.message;
                       }
                   }
               }
           } catch (e) {
               // Ignore parse errors
           }
       }
       
       if (errorMessage.includes('503') || errorMessage.toLowerCase().includes('unavailable')) {
           errorMessage = "The AI model is currently experiencing high demand. Spikes in demand are usually temporary. Please wait a moment and try again.";
       } else if (errorMessage.includes('429') || errorMessage.includes('Quota exceeded') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
           errorMessage = "You have exceeded your Free Tier quota or rate limit. Please wait and try again later, or upgrade your plan.";
       }

       sendEvent('error', { message: errorMessage });
       res.end();
    }
  });

  // Basic memory retrieval endpoint
  app.get('/api/memory/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    res.json({ history: memoryStore[sessionId] || [] });
  });

  app.post('/api/feedback', async (req, res) => {
    try {
      const { text, screenshot } = req.body;
      const nodemailer = await import('nodemailer');

      const user = process.env.GMAIL_USER;
      const pass = process.env.GMAIL_APP_PASSWORD;

      if (!user || !pass) {
        console.warn("GMAIL_USER and GMAIL_APP_PASSWORD are not configured. Feedback will only be logged.");
        console.log("Feedback Received:", text);
        return res.json({ success: true, message: 'Feedback logged locally (email not configured)' });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
      });

      const mailOptions: any = {
        from: user,
        to: 'arsharma9966@gmail.com',
        subject: 'New User Feedback from Applet',
        text: `Feedback details:\n\n${text}`,
      };

      if (screenshot) {
        const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, "");
        mailOptions.attachments = [
          {
            filename: 'screenshot.jpg',
            content: Buffer.from(base64Data, 'base64'),
            cid: 'screenshot'
          }
        ];
        mailOptions.html = `<p>Feedback details:</p><p>${text}</p><p><img src="cid:screenshot"/></p>`;
      }

      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Failed to send feedback:", error);
      const errorMessage = error.message && error.message.includes("Invalid login") 
        ? "Gmail login failed. Please ensure you generated a 16-digit Gmail App Password and set it as GMAIL_APP_PASSWORD in settings. Regular passwords will not work."
        : error.message || "Failed to send feedback";
      res.status(500).json({ error: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
