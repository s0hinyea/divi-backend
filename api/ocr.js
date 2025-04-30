import Tesseract from "tesseract.js";

export default async function handler(req, res){
  if (req.method !== 'POST'){
    return res.status(405).json({ error: 'Only POST requests allowed'})
  };

  const { image } = req.body
  if(!image) {
    return res.status(400) 
  }

 try{
  const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
  //takes image base64 string and strips off prefix so only actual Data Uri taken
  const imageBuffer = Buffer.from(base64Data, 'base64')
  //Tesseract reads raw binary data, not binary string, buffer turns it to that
  //Buffer holds raw binary data in memory, lets tools treat the base64 as a file 

  const result = await Tesseract.recognize(imageBuffer, 'eng');
  const extractedText = result.data.text;


  return res.status(200).json({
    text: extractedText
  });
} catch (error) {
  console.error(" OCR ERROR", error);
  return res.status(500).json({ error: 'Failed to process image'});
}

}

// req.body example : {"image": "data:image/jpeg;base64,/9j/4AAQSkZ..."}

