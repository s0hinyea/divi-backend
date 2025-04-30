
export default function handler(req, res){
  if (req.method !== 'POST'){
    return res.status(405).json({ error: 'Only POST requests allowed'})
  };

  const { image } = req.body
  if(!image) {
    return res.status(400) 
  }

  return res.status(200).json({
    status: 'received',
    length: image.length,
    snippet: image.slice(0, 30) + '...'
  });
}

// req.body example : {"image": "data:image/jpeg;base64,/9j/4AAQSkZ..."}

