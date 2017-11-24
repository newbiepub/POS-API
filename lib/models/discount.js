import {Schema} from "mongoose";
import db from "../db";

const ProductItems = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return v >= 0;
            },
            message: '{VALUE} is invalid price !'
        },
        default: 0
    },
    unit: {type: String, required: true}
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
        type: Array,
        default: ["percent", "amount"]
    },
    value: {
        type: Number,
        required: true
    },
    description: {type: String}
});

const Discount = db.model("discount", DiscountSchema, 'discount');

export {Discount};