import {Schema} from "mongoose";
import db from "../db";

const RoleSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String}
});

const Role = db.model("role", RoleSchema, "role");

export {Role};