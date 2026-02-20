import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * ElevenLabs API Integration
 * Handles Speech-to-Text (Scribe) and Text-to-Speech
 */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // CORS
  if (req.method === 'OPTIONS') {
    res.status(200).setHeader('Access-Control-Allow-Origin', '*').end();
    return;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'ElevenLabs API key not configured' });
    return;
  }

  const { action } = req.query;

  try {
    if (action === 'stt' && req.method === 'POST') {
      // Speech-to-Text (Scribe)
      // Expecting a multipart/form-data with an 'audio' file
      // For simplicity in a serverless function, we might need a library like busboy or use a simpler approach
      // However, if the frontend sends the binary directly, we can forward it
      
      const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': req.headers['content-type'] || 'audio/mpeg',
        },
        body: req.body, // Forward the body
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`ElevenLabs STT error: ${error}`);
      }

      const data = await response.json();
      res.status(200).json(data);
      return;
    }

    if (action === 'tts' && req.method === 'POST') {
      // Text-to-Speech
      const { text, voiceId = 'pNInz6obpguXPBWmwttX' } = req.body; // Default to Adam voice

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`ElevenLabs TTS error: ${error}`);
      }

      // Return the audio as a stream or base64
      const audioBuffer = await response.arrayBuffer();
      res.setHeader('Content-Type', 'audio/mpeg');
      res.status(200).send(Buffer.from(audioBuffer));
      return;
    }

    res.status(400).json({ error: 'Invalid action or method' });
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    res.status(500).json({
      error: 'ElevenLabs operation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
