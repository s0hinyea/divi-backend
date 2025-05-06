import express from 'express';
import cors from 'cors';
import Tesseract from 'tesseract.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Allow frontend requests from any domain (important!)
app.use(cors());

// Parse incoming JSON with large image payloads
app.use(express.json({ limit: '10mb' }));

// 👇 OCR endpoint
app.post('/ocr', async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  try {
    console.log('[OCR] Got image data');

    // Strip the base64 header
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Run OCR
    const result = await Tesseract.recognize(imageBuffer, 'eng');
    const extractedText = result.data.text;

    console.log('[OCR] Text extracted');
    res.status(200).json({ text: extractedText });
  } catch (error) {
    console.error('[OCR] ERROR:', error.message);
    res.status(500).json({ error: 'OCR failed', details: error.message });
  }
});

// Default home route
app.get('/', (req, res) => {
  res.send('Divi backend is running 🧠');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
