import {Schema} from "mongoose";
import db from "../db";

const IngredientSchema = new Schema({
    name: {type: String},
    description: {type: String},
    unit: {type: String},
    price: {
        type: String,
        default: 0,
        validate: {
            validator: function (v) {
                return v >= 0
            },
            message: "{VALUE} is invalid price !"
        }
    }
});

const Ingredient = db.model("ingredient", IngredientSchema, "ingredient");

export {Ingredient, IngredientSchema};