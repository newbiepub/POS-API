import {Schema} from "mongoose";
import db from "../db";

const product = new Schema({
    productId: {type: String}
});

const ingredient = new Schema({
    ingredientId: {type: String}
});

const InventorySchema = new Schema({
    employeeId: {
        type: String,
        required: true
    },
    isProduct: {
        type: Boolean,
        default: true
    },
    producer: {
        type: String
    },
    ingredient: [ingredient],
    productItems: [product]
});

const Inventory = db.model("inventory", InventorySchema, "inventory");

export {Inventory};