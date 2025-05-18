import express from 'express';
import cors from 'cors';
import Tesseract from 'tesseract.js';

const app = express();
//create instance of backend, your main application object 

const PORT = process.env.PORT || 3000;

// Allow frontend requests from any domain (important!)
app.use(cors()); 

// Parse incoming JSON with large image payloads
app.use(express.json({ limit: '10mb' }));

// 👇 OCR endpoint
app.post('/ocr', async (req, res) => {
  const { image } = req.body;

  if (!image) {
    console.log("Not image")
    return res.status(400).json({ error: 'No image provided' });
  }

  try {
    console.log('[OCR] Got new data');


    // Run OCR
    const result = await Tesseract.recognize(image, 'eng');
    const extractedText = result.data.text;

    console.log('[OCR] Text extracted');
    res.json({ text: extractedText });
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


