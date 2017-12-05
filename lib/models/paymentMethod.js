import {Schema} from "mongoose";
import db from "../db";

const PaymentMethodSchema = new Schema({
    employeeId:{type:String, required: true},
    name: {type: Array, required: true, default: ["Trả Trước", "Trả Sau"]},
    description: {type: String}
});

const PaymentMethod = db.model("payment_method", PaymentMethodSchema, "payment_method");

export {PaymentMethod};