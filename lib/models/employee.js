import {Schema} from "mongoose";
import db from "../db";

const EmployeeSchema = new Schema({
    companyId: {type: String, ref: "company", required: true},
    employeeProfile: { type: Object },
    username: {type: String, required: true},
    password: {type: String, required: true},
    fund: {type: Number, default: 0},
    isActivate: {type: Boolean, default: true},
    role: {type: String, required: true}
});

const Employee = db.model("employee", EmployeeSchema, "employee");

export {Employee};