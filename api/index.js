const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const faceapi = require('face-api.js');
const connectToMongoDB = require('../db/connectToMongoDB');
const faceCaptureRoutes = require('./faceCapture');
const faceLoginRoutes = require('./faceLogin');

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

const loadModels = async () => {
  const modelPath = path.join(__dirname, '../models');
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
};

app.use('/api', faceCaptureRoutes);
app.use('/api', faceLoginRoutes);

app.get('/', (req, res) => {
  res.send('hello mohsin from the backend');
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectToMongoDB();
  await loadModels();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
