import {Schema} from "mongoose";
import db from "../db";

const product = new Schema({
    productId: {type: String, required: true},
    quantity: {
        type: Number,
        default: 0,
        validate: {
            validator: (v) => v >= 0,
            message: "{VALUE} is not a valid quantity !"
        }
    },
});

const ingredient = new Schema({
    ingredientId: {type: String, required: true},
    quantity: {
        type: Number,
        default: 0,
        validate: {
            validator: (v) => v >= 0,
            message: "{VALUE} is not a valid quantity !"
        }
    },
});

const InventorySchema = new Schema({
    employeeId: {
        type: String
    },
    companyId: {
        type: String
    },
    ingredient: [ingredient],
    productItems: [product]
});

const Inventory = db.model("inventory", InventorySchema, "inventory");

export {Inventory};