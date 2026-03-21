import mongoose, { Schema, Document } from "mongoose";

export interface IScheme extends Document {
  title: string;
  provider: string;
  description: string;
  shortDescription: string; // Keeping for backward compatibility or migration
  fullDescription: string;
  category: string;
  
  // Eligibility
  ageLimit?: string;
  incomeCriteria?: string;
  targetGroup: string;
  
  // Benefits
  financialBenefit?: string;
  otherBenefits?: string;
  
  // Dates
  startDate?: Date;
  lastDate?: Date;
  status: "Active" | "Expired";
  
  // Links & Media
  officialWebsite?: string;
  applyLink?: string;
  image?: string; // Cloudinary URL
  
  createdAt: Date;
  updatedAt: Date;
}

const SchemeSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    provider: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    category: { type: String, required: true },
    
    ageLimit: { type: String },
    incomeCriteria: { type: String },
    targetGroup: { type: String, required: true },
    
    financialBenefit: { type: String },
    otherBenefits: { type: String },
    
    startDate: { type: Date },
    lastDate: { type: Date },
    status: {
      type: String,
      default: "Active"
    },
    
    officialWebsite: { type: String },
    applyLink: { type: String },
    image: { type: String }
  },
  { timestamps: true }
);


export default mongoose.models.Scheme || mongoose.model<IScheme>("Scheme", SchemeSchema);
