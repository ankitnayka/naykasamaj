import mongoose, { Schema, Document } from "mongoose";

export interface IMatrimonyProfile extends Document {
  user: mongoose.Types.ObjectId;
  gender: "MALE" | "FEMALE";
  dateOfBirth: Date;
  height: string; // e.g. "5'9"
  maritalStatus: "NEVER_MARRIED" | "DIVORCED" | "WIDOWED";
  education: string;
  occupation: string;
  income?: string;
  location: string;
  aboutMe: string;
  partnerPreferences: {
    ageRange: string; // e.g. "25-30"
    education: string;
    maritalStatus: string;
  };
  photos: string[];
  isPrivacyEnabled: boolean;
  isApproved: boolean; // Moderation flag
  createdAt: Date;
  updatedAt: Date;
}

const MatrimonyProfileSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    gender: { type: String, enum: ["MALE", "FEMALE"], required: true },
    dateOfBirth: { type: Date, required: true },
    height: { type: String, required: true },
    maritalStatus: { type: String, enum: ["NEVER_MARRIED", "DIVORCED", "WIDOWED"], default: "NEVER_MARRIED" },
    education: { type: String, required: true },
    occupation: { type: String, required: true },
    income: { type: String },
    location: { type: String, required: true },
    aboutMe: { type: String, required: true },
    partnerPreferences: {
      ageRange: { type: String },
      education: { type: String },
      maritalStatus: { type: String },
    },
    photos: [{ type: String }],
    isPrivacyEnabled: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.MatrimonyProfile || mongoose.model<IMatrimonyProfile>("MatrimonyProfile", MatrimonyProfileSchema);
