import mongoose, { Schema, Document } from "mongoose";

export interface INewsCategory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.NewsCategory || mongoose.model<INewsCategory>("NewsCategory", NewsCategorySchema);
