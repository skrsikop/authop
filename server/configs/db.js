import mongoose from "mongoose";

const connectDB = async() => {
  mongoose.connection.on('connected', () => {
    console.log('Mongodb Connected successfully');
  })
  await mongoose.connect(`${process.env.MONGODB_URL}/authop`)
}

export default connectDB