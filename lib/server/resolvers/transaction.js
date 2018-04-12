import {Transaction, PaymentStatus} from "../models/modelConfigs";

export async function createTransaction(employeeId, companyId, productItems, paymentStatus, paymentMethod, dueDate, totalQuantity, totalPrice, paid, description, customer, createdAt, issueRefund, issueRefundReason,refundDate) {
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