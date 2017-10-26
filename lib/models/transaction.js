import {Schema} from "mongoose";
import db from "../db";

const ProductItems = new Schema({
    productId: {type: String, required: true},
    quantity: {
        type: String, required: true, default: 0,
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: "{VALUE} is not a valid quantity"
        }
    },
    price: {type: String, required: true},
    unit: {type: String, required: true}
});

const TransactionSchema = new Schema({
    productItems: [ProductItems],
    companyId: {type: String, required: true},
    employeeId: {type: String, required: true,},
    date: {type: Date, required: true, default: new Date()},
    paymentMethod: {type: String, required: true},
    paymentStatus: {type: String, required: true},
    description: {type: String}
});



const Transaction = db.model("transaction", TransactionSchema, "transaction");

export {Transaction};