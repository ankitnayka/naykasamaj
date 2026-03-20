import mongoose, { Schema, Document } from "mongoose";

export interface IScheme extends Document {
  title: string;
  description: string;
  provider: "CENTRAL" | "STATE" | "NGO";
  category: "EDUCATION" | "HEALTH" | "BUSINESS" | "AGRICULTURE" | "HOUSING";
  eligibility: string[];
  applicationLink?: string;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SchemeSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    provider: {
      type: String,
      enum: ["CENTRAL", "STATE", "NGO"],
      required: true,
    },
    category: {
      type: String,
      enum: ["EDUCATION", "HEALTH", "BUSINESS", "AGRICULTURE", "HOUSING"],
      required: true,
    },
    eligibility: [{ type: String }],
    applicationLink: { type: String },
    deadline: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Scheme || mongoose.model<IScheme>("Scheme", SchemeSchema);
