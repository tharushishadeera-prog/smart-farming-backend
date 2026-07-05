import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.DB_URL as string);

    console.log(" MongoDB Connected");
  } catch (error) {
    console.error(" MongoDB Connection Failed");
    console.error(error);

    process.exit(1);
  }
};

export default connectDB;