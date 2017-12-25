import {Schema} from "mongoose";
import db from "../db";

const ProductItems = new Schema({
    _id: {
        type: String,
        required: true
    },
});

const EmployeeDiscount = new Schema({
    _id:{
        type: String,
        required: true
    }
});
const DiscountSchema = new Schema({
    productItems: [ProductItems],
    companyId: {
        type: String,
        required: true
    },
    employeeId: [EmployeeDiscount],
    name: {
        type: String
    },
    type: {
        type: String,
        default: "percent"
    },
    value: {
        type: Number,
        validate: {
          validator: (v) => {
              return v >= 0
          },
            message: '{VALUE} is invalid !'
        },
        required: true
    },
    description: {type: String}
});

const Discount = db.model("discount", DiscountSchema, 'discount');

export {Discount};