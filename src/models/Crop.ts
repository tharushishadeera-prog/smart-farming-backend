import mongoose, { Schema, Document } from "mongoose";

export interface ICrop extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  variety: string; 
  plantedDate: Date;
  status: "PLANTED" | "GROWING" | "DISEASE_DETECTED" | "HARVESTED";
  landSize: number; 
  createdAt: Date;
  moisture?: number;
}

const CropSchema: Schema = new Schema<ICrop>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true
  },
  name: {
    type: String,
    required: [true, "Crop name is required"]
  },
  variety: {
    type: String,
    default: "General"
  },
  plantedDate: {
    type: Date,
    required: [true, "Planted date is required"]
  },
  status: {
    type: String,
    enum: ["PLANTED", "GROWING", "DISEASE_DETECTED", "HARVESTED"],
    default: "PLANTED"
  },
  landSize: {
    type: Number,
    required: [true, "Land size is required"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  moisture: {
    type: Number
  }
});

export default mongoose.model<ICrop>("Crop", CropSchema);