import {Schema} from "mongoose";
import db from "../db";
import {Company} from "./company";
import faker from "faker";
import consolidate from "consolidate";
import path from "path";
import {Invoice} from "./invoice";

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


/**
 * Create Invoice
 * @param instance
 * @returns {Promise.<void>}
 */
async function createInvoice(instance) {
    try {
        let currentCompany = await Company.findOne({_id: instance.companyId}).exec() || {},
            productItems = instance.productItems,
            paymentMethod = instance.paymentMethod,
            invoiceId = faker.random.uuid(),
            employeeId = instance.employeeId,
            createdAt = new Date(),
            total = 0;

        for(let productItem of productItems) {

            total += (+productItem.totalPrice);

            for(let discountItem of productItem.discount) {
                discountItem.discount = `-${discountItem.type === "percent" ? Math.floor(productItem.price * (discountItem.value / 100)) : discountItem.value}đ`;
                discountItem.discountValue = discountItem.type === "percent" ? `${discountItem.value}%` : `${discountItem.value}đ`;
            }
        }

        consolidate.mustache(path.resolve(__dirname, "../templateInvoice/invoice.html"), {
            company: {
                companyName: currentCompany.companyProfile.companyName || "",
                email: currentCompany.companyEmail
            },
            invoice: {
                invoiceId,
                createdAt: require("moment")(createdAt).locale("vi").format("dddd, Do/MM/YYYY, h:mm:ss a")
            },
            trans: {
                paymentMethod
            },
            productItems,
            total: `${total}đ`
        } , async (err, html) => {
            try {
                await new Invoice({
                    invoiceId,
                    createdAt,
                    content: html,
                    employeeId
                }).save();
            } catch(e) {
                console.log(e);
            }
        })
    } catch(e) {
        console.log(e);
    }
}

TransactionSchema.pre("save", function (next) {
    if(this.paymentStatus === "Đã Thanh Toán") {
        createInvoice(this);
    }
    next();
});

const Transaction = db.model("transaction", TransactionSchema, "transaction");

const IssueRefund = db.model("issue_refund", IssueRefundSchema, "issue_refund");


export {Transaction, ProductItems, IssueRefund};