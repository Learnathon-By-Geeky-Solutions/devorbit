import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  user_roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String },
    user_roles: { type: [String], required: true, default: ["user"] },
  },
  { timestamps: true }
);

const User =
  mongoose.models.User || 
  mongoose.model<UserDocument>("User", UserSchema);

export default User;
