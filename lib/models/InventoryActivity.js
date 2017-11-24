import {Schema} from "mongoose";
import db from "../db";
import {IngredientSchema} from "./ingredient";
import {ProductItems} from "./transaction";

const InventoryActivitySchema = new Schema({
    employeeId: {
        type: String,
        required: true
    },
    isProduct: {
        type: Boolean,
        default: true
    },
    activity: {
        type: Array,
        default: ['nhap', 'xuat']
    },
    IngredientSchema,
    ProductItems
});

const InventoryActivity = db.model("inventory_activity", InventoryActivitySchema, "inventory_activity");

export {InventoryActivity};