import mongoose, { Schema } from "mongoose";

interface IVoice extends Document {
    userId: number;
    title: string;
    fileId: string;
    duration: number;
}

const VoiceSchema = new Schema<IVoice>({
    userId: { type: Number, required: true },
    title: { type: String, required: true },
    fileId: { type: String, required: true },
    duration: { type: Number, required: true },
});

export const Voice = mongoose.model<IVoice>("Voice", VoiceSchema);
