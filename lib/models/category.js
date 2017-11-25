import {Schema} from "mongoose";
import db from "../db";

const CategorySchema = new Schema({
    name: {type: String, required: true},
    employeeId: {type: String, required: true},
    description: {type: String}
});

const Category = db.model("category", CategorySchema, "category");

export {Category};