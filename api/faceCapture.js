const express = require('express');
const axios = require('axios');
const User = require('../models/User');

const router = express.Router();

const fetchImageAsBase64 = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return base64Image;
  } catch (error) {
    console.error('Error fetching image:', error);
    throw new Error('Failed to fetch image');
  }
};

router.post('/face-capture', async (req, res) => {
  const { imageUrl, userId } = req.body;
  if (!imageUrl || !userId) {
    return res.status(400).send('Missing imageUrl or userId');
  }

  try {
    const base64Image = await fetchImageAsBase64(imageUrl);

    const user = new User({ userId, image: base64Image });
    await user.save();

    res.send('Image URL saved successfully');
  } catch (error) {
    res.status(500).send('Failed to save image URL');
  }
});

module.exports = router;
