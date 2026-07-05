import mongoose , {Schema,Document} from "mongoose";

export interface IHarvest extends Document{
  user: mongoose.Types.ObjectId;
  crop: mongoose.Types.ObjectId;
  quantity: number;
  sellingPrice: number;
  date: Date;
}

const HarvestSchema: Schema = new Schema(
    {
        user:{type:Schema.Types.ObjectId,ref:"User",required:true},
        crop: { type: Schema.Types.ObjectId, ref: "Crop", required: true},
        quantity:{type:Number,required:true},
        sellingPrice:{type:Number,required:true},
        date:{type:Date,required:true},
    },
    {timestamps:true}
);
export default mongoose.model<IHarvest>("Harvest", HarvestSchema);