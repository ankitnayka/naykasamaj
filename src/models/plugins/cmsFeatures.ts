import mongoose, { Schema } from "mongoose";

export interface ICMSFeatures {
  status: "DRAFT" | "PENDING_REVIEW" | "LABEL_REVIEW" | "APPROVED" | "ARCHIVED";
  visibility: "PUBLIC" | "MEMBER_ONLY" | "ADMIN_ONLY";
  history: Array<{
    changedBy: mongoose.Types.ObjectId;
    action: string;
    timestamp: Date;
    fieldChanged?: string;
  }>;
}

export const cmsFeatureSchemaFields = {
  status: {
    type: String,
    enum: ["DRAFT", "PENDING_REVIEW", "LABEL_REVIEW", "APPROVED", "ARCHIVED"],
    default: "DRAFT",
  },
  visibility: {
    type: String,
    enum: ["PUBLIC", "MEMBER_ONLY", "ADMIN_ONLY"],
    default: "PUBLIC",
  },
  history: [
    {
      changedBy: { type: Schema.Types.ObjectId, ref: "User" },
      action: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      fieldChanged: { type: String },
    },
  ],
};

// Mongoose Plugin
export function cmsPlugin(schema: Schema, options?: any) {
  schema.add(cmsFeatureSchemaFields);
}
