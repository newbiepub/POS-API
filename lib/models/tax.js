import {Schema} from "mongoose";
import db from "../db";



const TaxSchema = new Schema({
    companyId:{type: String,required: true},
    tax:{type:Number,min:0,max:100,required:true},
    createAt:{type:Date, required: true, default: new Date()}
});


const Tax = db.model("tax", TaxSchema, "tax");

export {Tax};