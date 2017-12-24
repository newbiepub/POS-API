import {Schema} from "mongoose";
import db from "../db";
const InvoiceSchema = new Schema({
    invoiceId: {type: String, required: true},
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

const Invoice = db.model("invoice", InvoiceSchema, "invoice");

export {Invoice};