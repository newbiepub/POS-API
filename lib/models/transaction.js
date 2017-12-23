import {Schema} from "mongoose";
import db from "../db";

const Discount = new Schema({
    name: {type: String, required: true},
    value: {type: Number, default: 0},
    type: {type: String, default: "percent", enum: ['percent', 'amount']},
    description:{type:String}

});
const ProductItems = new Schema({
    name: {type: String},
    quantity: {
        type: Number, default: 1,
        validate: {
            validator: function (value) {
                return value >= 0;
            },
            message: "{VALUE} is not a valid quantity"
        }
    },
    discount: [Discount],
    price: {type: Number, required: true},
    totalPrice: {type: Number,required: true},
    unit: {type: String, required: true}
});

const IssueReasonSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String}
});

const IssueRefundSchema = new Schema({
    amount: {
        type: Number,
        default: 0,
        validate: {
            validator: (v) => {
                return v >= 0
            },
            message: "{VALUE} is not a valid amount"
        }
    },
    refundDate: {type: Date, required: true, default: new Date()},
    reason: [IssueReasonSchema]
});

const TransactionSchema = new Schema({
    productItems: [ProductItems],
    companyId: {type: String, required: true},
    employeeId: {type: String, required: true,},
    date: {type: Date, required: true, default: new Date()},
    paymentMethod: {type: String, required: true},
    paymentStatus: {type: String, required: true},
    tax: {type:Number, default:0,max: 100 ,min: 0},
    description: {type: String},
    totalPrice: {type: Number, required: true},
    type: {type: String, required: true, default: 'Thu'},
    issue_refund: IssueRefundSchema
});

TransactionSchema.pre("save", function (next) {
    next();
});

const Transaction = db.model("transaction", TransactionSchema, "transaction");

const IssueRefund = db.model("issue_refund", IssueRefundSchema, "issue_refund");


export {Transaction, ProductItems, IssueRefund};