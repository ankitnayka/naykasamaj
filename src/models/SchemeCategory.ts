import mongoose, { Schema, Document } from "mongoose";

export interface ISchemeCategory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SchemeCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.SchemeCategory || mongoose.model<ISchemeCategory>("SchemeCategory", SchemeCategorySchema);
