import mongoose, { Schema, Document } from "mongoose";
import { ICMSFeatures, cmsPlugin } from "./plugins/cmsFeatures";

export interface IArticle extends Document, ICMSFeatures {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  images?: string[];
  gallery?: string[];
  authorId?: mongoose.Types.ObjectId;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    category: {
      type: String,
      default: "News",
    },
    tags: [{ type: String }],
    imageUrl: { type: String },
    images: [{ type: String }],
    gallery: [{ type: String }],
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

ArticleSchema.plugin(cmsPlugin);

export default mongoose.models.Article || mongoose.model<IArticle>("Article", ArticleSchema);
