import {Schema} from "mongoose";
import db from "../db";

const CategorySchema = new Schema({
    companyId:{type:String, ref:"company", required: true},
    name: {type: String, required: true},
    employeeId: {type: String},
    description: {type: String}
});

const Category = db.model("category", CategorySchema, "category");

export {Category};