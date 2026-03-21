import mongoose, { Schema, Document } from "mongoose";
import { ICMSFeatures, cmsPlugin } from "./plugins/cmsFeatures";

export interface IEvent extends Document, ICMSFeatures {
  title: string;
  description: string;
  date: Date;
  location: string;
  category: string;
  isVirtual: boolean;
  meetingLink?: string;
  images?: string[];
  gallery?: string[];
  organizer?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    category: {
      type: String,
      required: true,
    },
    isVirtual: { type: Boolean, default: false },
    meetingLink: { type: String },
    images: [{ type: String }],
    gallery: [{ type: String }],
    organizer: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

EventSchema.plugin(cmsPlugin);

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
