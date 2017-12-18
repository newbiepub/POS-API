import {Schema} from "mongoose";
import db from "../db";

const ProductItems = new Schema({
    _id: {
        type: String,
        required: true
    },
});

const DiscountSchema = new Schema({
    productItems: [ProductItems],
    companyId: {
        type: String,
        required: true
    },
    employeeId: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    type: {
        type: String,
        default: "percent"
    },
    value: {
        type: Number,
        required: true
    },
    description: {type: String}
});

const Discount = db.model("discount", DiscountSchema, 'discount');

export {Discount};