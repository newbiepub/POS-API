import {Schema} from "mongoose";
import db from "../db";

const PaymentStatusSchema = new Schema({
    name: {type: Array, required: true, default: ["Chưa Thanh Toán", "Đã Thanh Toán"]},
    description: {type: String}
});

const PaymentStatus = db.model("payment_status", PaymentStatusSchema, "payment_status");

export {PaymentStatus};