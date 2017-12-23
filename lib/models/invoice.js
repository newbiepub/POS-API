import {Schema} from "mongoose";
import db from "../db";
const Invoice = new Schema({
    employeeId: {
        type: String,
        required: true
    },
    content:{
        type:String,
        required: true,
    },
    createdAt: {type: Date, default: new Date()}
});

const Invoice = db.model("invoice", Invoice, "invoice");

export {Invoice};