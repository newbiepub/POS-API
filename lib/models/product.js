import {Schema} from "mongoose";
import db from "../db";

const ProductSchema = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    unit: {type: String, required: true},
    description: {type: String},
    detail: {type: Object},
    productVariantParent: {type: String},
    categoryId: {type: String, required}
});

const Product = db.model("product", ProductSchema, "product");

export {Product};