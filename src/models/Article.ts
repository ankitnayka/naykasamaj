import mongoose, { Schema, Document } from "mongoose";

export interface IArticle extends Document {
  title: string;
  content: string;
  excerpt?: string;
  category: "NEWS" | "ALERT" | "FACT_CHECK" | "STATEMENT" | "BLOG";
  tags: string[];
  imageUrl?: string;
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
      enum: ["NEWS", "ALERT", "FACT_CHECK", "STATEMENT", "BLOG"],
      default: "NEWS",
    },
    tags: [{ type: String }],
    imageUrl: { type: String },
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Article || mongoose.model<IArticle>("Article", ArticleSchema);
