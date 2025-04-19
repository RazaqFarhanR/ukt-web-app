const express = require('express');
const app = express();
const path = require('path');

app.get('/image/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../image', filename);
  
    // Use the imagePath to send the image back to the client
    res.sendFile(imagePath);
  });