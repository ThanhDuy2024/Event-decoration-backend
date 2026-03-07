import mongoose from "mongoose";

export const mongodbConnect = async () => {
  try {
    mongoose.connect(String(process.env.MONGODB_URL));
    console.log('Mongodb has connected!')
  } catch (error) {
    console.log('Database is not connect!');
  }
}