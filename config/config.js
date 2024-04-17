const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4
    })
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

const sessionSecret = 'mysitesessionsecret';

module.exports = {
  sessionSecret,
  connectDB
}


