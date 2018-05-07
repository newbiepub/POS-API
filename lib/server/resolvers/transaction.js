import {Transaction, PaymentStatus} from "../models/modelConfigs";
import invoiceHTML from '../../utils/invoiceTemplate';
import Mustache from 'mustache';
import moment from '../../utils/moment';

var nodemailer = require('nodemailer');

export async function createTransaction(employeeId, companyId, productItems, paymentStatus, paymentMethod, dueDate, totalQuantity, totalPrice, paid, description, customer, createdAt, issueRefund, issueRefundReason, refundDate) {
    let trans = null;
    try {
        trans = await new Transaction({
            employeeId,
            companyId,
            productItems,
            paymentStatus,
            paymentMethod,
            dueDate,
            totalQuantity,
            totalPrice,
            paid,
            description,
            customer,
            createdAt,
            issueRefund,
            issueRefundReason,
            refundDate
        }).save();
        return await Transaction
            .findOne({_id: trans._id})
            .exec();
    } catch (e) {
        throw e;
    }
}

export async function updateTransaction(_id, dueDate, paid, description) {
    let trans = null;
    try {
        let paymentStatus = await PaymentStatus.find().exec(), thisTrans = await Transaction
            .findOne({_id: _id})
            .exec();
        let totalPaid = 0;
        for (let items of thisTrans.paid) {
            totalPaid += items.amount;
        }
        if (thisTrans.totalPrice > (totalPaid + paid.amount)) {
            trans = await Transaction.update(
                {_id: _id},
                {$addToSet: {paid: paid}, dueDate: dueDate, description: description}
            );
        } else {
            trans = await Transaction.update(
                {_id: _id},
                {$addToSet: {paid: paid}, paymentStatus: paymentStatus[0], dueDate: dueDate, description: description}
            );
        }
        return await Transaction
            .findOne({_id: _id})
            .exec();

    } catch (e) {
        throw e;
    }
}

export async function issueRefundTransaction(_id, issueRefundReason, refundDate) {
    try {
        await Transaction.update({
            _id: _id,
        }, {$set: {issueRefund: true, issueRefundReason: issueRefundReason, refundDate: refundDate}}).exec();
        return await Transaction
            .findOne({_id: _id})
            .exec();

    } catch (e) {
        throw e;
    }
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_INVOICE,
        pass: process.env.PASS_EMAIL_INVOICE
    }
});

export async function sendMailInvoice(email, transaction, profile) {
    try {

        if (email && (new RegExp(/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm)).test(email)) {
            let content = {
                company: {
                    companyName: profile.name || "",
                    email: profile.email || "",
                    address: profile.address || "",
                    phoneNumber: profile.phone || ""
                },
                invoice: {
                    invoiceId: transaction._id || "",
                    createdAt: moment(new Date()).format(`DD/MM/YYYY: hh:mm a`) || "",
                },
                trans: {
                    paymentMethod: transaction.paymentMethod.name || ""
                },
                productItems: transaction.productItems,
                total: transaction.totalPrice
            };
            let html = await Mustache.to_html(invoiceHTML, content);
            transporter.sendMail({
                from: 'pos@no-reply.com',
                to: email,
                subject: 'HOÁ ĐƠN BÁN HÀNG ',
                html: html
            }, function (error, info) {
                if (error) {
                    return false
                } else {
                    return true
                }
            });
            return false
        }

    } catch (e) {
        throw e;
    }
}