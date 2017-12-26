import {Schema} from "mongoose";
import db from "../db";

const product = new Schema({
    productId: {type: String, required: true},
    quantity: {
        type: Number,
        default: 0,
        min: 0,
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
        min: 0,
        validate: {
            validator: (v) => v >= 0,
            message: "{VALUE} is not a valid quantity !"
        }
    },
});

const InventoryActivitySchema = new Schema({
    employeeId: {
        type: String,
        required: true
    },
    activity: {
        type: Array,
        default: ['Nhập Kho', 'Xuất Kho']
    },
    createdAt: {type: Date, defaultValue: new Date()},
    productItems: [product],
    ingredient: [ingredient]
});

const InventoryActivity = db.model("inventory_activity", InventoryActivitySchema, "inventory_activity");

export {InventoryActivity};