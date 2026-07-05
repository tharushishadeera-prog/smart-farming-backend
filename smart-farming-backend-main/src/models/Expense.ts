import mongoose, { Schema , Document } from "mongoose";

export interface IExpense extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    amount: number;
    category: string;
    date: Date;

}

const ExpenseSchema: Schema = new Schema(
    {
        user :{type:Schema.Types.ObjectId,ref:"User",required: true},
        title :{type:String,required:true,trim:true},
        amount: {type:Number,required:true},
        category :{type:String,required:true},
        date:{type:Date,default:Date.now},
    },
    {timestamps:true}
);
export default mongoose.model<IExpense>("Expense", ExpenseSchema);