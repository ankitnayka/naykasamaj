import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  category: "EDUCATION" | "FARMING" | "HEALTH" | "EMERGENCY" | "GENERAL";
  author: mongoose.Types.ObjectId;
  isAnonymous: boolean;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ["EDUCATION", "FARMING", "HEALTH", "EMERGENCY", "GENERAL"],
      default: "GENERAL",
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isAnonymous: { type: Boolean, default: false },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export interface IComment extends Document {
  content: string;
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Comment = mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
