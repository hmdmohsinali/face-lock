const express = require('express');
const axios = require('axios');
const canvas = require('canvas');
const faceapi = require('face-api.js');
const User = require('../models/User');

const router = express.Router();

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

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

router.post('/face-login', async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).send('Missing imageUrl');
  }

  try {
    const base64Image = await fetchImageAsBase64(imageUrl);

    const buffer = Buffer.from(base64Image, 'base64');
    const img = await canvas.loadImage(buffer);

    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
    const faceMatcher = new faceapi.FaceMatcher(detections);

    const users = await User.find();
    for (const user of users) {
      const userImageBuffer = Buffer.from(user.image, 'base64');
      const userImg = await canvas.loadImage(userImageBuffer);
      const userDetections = await faceapi.detectAllFaces(userImg).withFaceLandmarks().withFaceDescriptors();
      const userDescriptor = userDetections[0].descriptor;

      const bestMatch = faceMatcher.findBestMatch(userDescriptor);
      if (bestMatch.label !== 'unknown') {
        return res.send({ userId: user.userId });
      }
    }

    res.status(401).send('No matching face found');
  } catch (error) {
    res.status(500).send('Failed to process image');
  }
});

module.exports = router;
