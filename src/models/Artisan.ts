import mongoose, { Schema, Document } from "mongoose";

export interface IArtisan extends Document {
  name: string;
  bio: string;
  craftType: string;
  location: string;
  contactEmail: string;
  contactPhone?: string;
  imageUrl?: string;
  ownerId: mongoose.Types.ObjectId;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ArtisanSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    bio: { type: String, required: true },
    craftType: { type: String, required: true },
    location: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    imageUrl: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Artisan || mongoose.model<IArtisan>("Artisan", ArtisanSchema);
