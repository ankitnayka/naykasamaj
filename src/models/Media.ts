import mongoose, { Schema, Document } from "mongoose";

export interface IMedia extends Document {
  title: string;
  description?: string;
  type: "PHOTO" | "VIDEO" | "AUDIO";
  url: string;
  thumbnailUrl?: string; // For videos
  category: "FESTIVAL" | "CEREMONY" | "TRADITIONAL_SONG" | "ORAL_HISTORY" | "DOCUMENTARY";
  uploadedBy?: mongoose.Types.ObjectId;
  isSensitiveTK: boolean; // Traditional Knowledge label for sensitive cultural items
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: ["PHOTO", "VIDEO", "AUDIO"],
      required: true,
    },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    category: {
      type: String,
      enum: ["FESTIVAL", "CEREMONY", "TRADITIONAL_SONG", "ORAL_HISTORY", "DOCUMENTARY"],
      required: true,
    },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    isSensitiveTK: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);
