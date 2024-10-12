import mongoose from "mongoose";
import { MONGODB_URI } from "../configs/index.js";
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.log(error);
    }
};
