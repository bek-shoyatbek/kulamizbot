import mongoose from "mongoose";
import { MONGODB_URI } from "../configs";


export const connectDB = async () => {

    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}