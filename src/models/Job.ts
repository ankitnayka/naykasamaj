import mongoose, { Schema, Document } from "mongoose";
import { ICMSFeatures, cmsPlugin } from "./plugins/cmsFeatures";

export interface IJob extends Document, ICMSFeatures {
  title: string;
  company: string;
  location: string;
  type: "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "FREELANCE";
  description: string;
  requirements: string[];
  applyLink?: string;
  contactEmail?: string;
  contactPhone?: string;
  isSkillDevelopment: boolean;
  postedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "FREELANCE"],
      required: true,
    },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    applyLink: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String },
    isSkillDevelopment: { type: Boolean, default: false },
    postedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

JobSchema.plugin(cmsPlugin);

export default mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
