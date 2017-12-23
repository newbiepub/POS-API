import {Schema} from "mongoose";
import db from "../db";

const ProductPrice = new Schema({
   _id: {type: String, required: true},
    name: {type: String},
    price: {type: Number, defaultValue: 0, validate: {
        validator: (v) => {
            return v >= 0
        },
        message: '{VALUE} is not a valid number !'
    }}
});

const ProductSchema = new Schema({
    companyId:{type: String},
    employeeId:{type: String, required:true},
    name: {type: String, required: true},
    price: [ProductPrice],
    unit: {type: String, required: true},
    description: {type: String},
    detail: {type: Object},
    productVariantParent: {type: String},
    categoryId: {type: String},
    producer: {type: String},
    createdAt: {type: Date, default: new Date()}
});

const Product = db.model("product", ProductSchema, "product");

export {Product};