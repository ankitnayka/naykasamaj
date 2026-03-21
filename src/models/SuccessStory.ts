import mongoose, { Schema, Document } from "mongoose";

export interface ISuccessStory extends Document {
  title: string;
  artisanName: string;
  artisanId?: mongoose.Types.ObjectId;
  story: string;
  images: string[];
  craftType: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const SuccessStorySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    artisanName: { type: String, required: true },
    artisanId: { type: Schema.Types.ObjectId, ref: "Artisan" },
    story: { type: String, required: true },
    images: [{ type: String }],
    craftType: { type: String, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.SuccessStory || mongoose.model<ISuccessStory>("SuccessStory", SuccessStorySchema);
