import mongoose from "mongoose";
const connectDB = async () => {
    try {
      const conenctionInstance=  await mongoose.connect(process.env.MONGO_URI)
        console.log(`DB connected : hosted at -> ${conenctionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error", error)
        process.exit(1);
    }
}

export default connectDB