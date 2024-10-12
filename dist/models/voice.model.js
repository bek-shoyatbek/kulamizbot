import mongoose, { Schema } from "mongoose";
const VoiceSchema = new Schema({
    userId: { type: Number, required: true },
    title: { type: String, required: true },
    fileId: { type: String, required: true },
    duration: { type: Number, required: true },
});
export const Voice = mongoose.model("Voice", VoiceSchema);
