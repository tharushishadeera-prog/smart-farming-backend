import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    createdAt: Date;
}

const userSchema: Schema = new Schema<IUser>({
  name: { 
    type: String, 
    required: [true, "Name is required"] 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true, 
    lowercase: true,
    trim: true
  },
  passwordHash: { 
    type: String, 
    required: [true, "Password is required"] 
  },
  role: { type: String, enum: ['farmer', 'admin'], default: 'farmer' },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model<IUser>("User", userSchema);