import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  category: "CULTURAL" | "MEETING" | "WORKSHOP" | "HEALTH_DRIVE";
  isVirtual: boolean;
  meetingLink?: string;
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
      enum: ["CULTURAL", "MEETING", "WORKSHOP", "HEALTH_DRIVE"],
      required: true,
    },
    isVirtual: { type: Boolean, default: false },
    meetingLink: { type: String },
    organizer: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
