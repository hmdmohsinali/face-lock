const mongoose = require('mongoose');

const connectToMongoDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://hafizg346:QHFJ2Wp2Ub4LAvnb@cluster0.4orv1nb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectToMongoDB;
