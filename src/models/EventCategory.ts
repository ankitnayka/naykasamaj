import mongoose, { Schema, Document } from "mongoose";

export interface IEventCategory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.EventCategory || mongoose.model<IEventCategory>("EventCategory", EventCategorySchema);
