import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: "GUEST" | "MEMBER" | "VERIFIED_MEMBER" | "MODERATOR" | "ADMIN" | "CURATOR" | "EDITOR" | "VIEWER";
  avatar?: string;
  isVerified: boolean;
  village?: string;
  profession?: string;
  ageGroup?: string;
  bio?: string;
  status?: "ACTIVE" | "SUSPENDED" | "BLOCKED";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional if using OAuth or OTP
    phone: { type: String },
    role: {
      type: String,
      enum: ["GUEST", "MEMBER", "VERIFIED_MEMBER", "MODERATOR", "ADMIN", "CURATOR", "EDITOR", "VIEWER"],
      default: "MEMBER",
    },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    village: { type: String },
    profession: { type: String },
    ageGroup: { type: String },
    bio: { type: String },
    status: { type: String, enum: ["ACTIVE", "SUSPENDED", "BLOCKED"], default: "ACTIVE" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
