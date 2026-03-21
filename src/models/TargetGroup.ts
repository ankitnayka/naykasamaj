import mongoose, { Schema, Document } from "mongoose";

export interface ITargetGroup extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TargetGroupSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.TargetGroup || mongoose.model<ITargetGroup>("TargetGroup", TargetGroupSchema);
