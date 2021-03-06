import {Schema} from "mongoose";
import db from "../db";
import {Inventory} from "./inventory";

const EmployeeSchema = new Schema({
    companyId: {type: String, ref: "company", required: true},
    employeeProfile: { type: Object },
    username: {type: String, required: true},
    password: {type: String, required: true},
    fund: {type: Number, default: 0},
    isActivate: {type: Boolean, default: true},
    role: {type: String}
});

async function createEmployeeInventory(employee) {
    try {
        let companyInventory = await Inventory.findOne({companyId: employee.companyId}).exec() || {},
            productItems = companyInventory.productItems || [],
            ingredient = companyInventory.ingredient || [];
        await new Inventory({
            ingredient: ingredient.map(item => ({ingredientId: item.ingredientId, quantity: 0})),
            productItems: productItems.map(item => ({productId: item.productId, quantity: 0})),
            employeeId: employee._id.toString(),
        }).save()
    } catch(e) {
        console.log(e);
    }
}

EmployeeSchema.post("save", (doc) => {
    createEmployeeInventory(doc)
});

const Employee = db.model("employee", EmployeeSchema, "employee");

export {Employee};