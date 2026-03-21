import mongoose, { Schema, Document } from "mongoose";
import { ICMSFeatures, cmsPlugin } from "./plugins/cmsFeatures";

export interface IHeritageItem extends Document, ICMSFeatures {
  title: string;
  description: string;
  content: string;
  category: mongoose.Types.ObjectId;
  mediaUrls: string[];
  tkLabels: string[]; // Traditional Knowledge Labels (e.g., 'SACRED', 'ELDERS_ONLY')
  authorId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HeritageItemSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "HeritageCategory" },
    mediaUrls: [{ type: String }],
    tkLabels: [{ type: String }],
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

HeritageItemSchema.plugin(cmsPlugin);

export default mongoose.models.HeritageItem || mongoose.model<IHeritageItem>("HeritageItem", HeritageItemSchema);
