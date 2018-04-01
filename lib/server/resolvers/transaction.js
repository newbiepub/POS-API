import {Transaction} from "../models/modelConfigs";

export async function createTransaction(employeeId, companyId, productItems, type, paymentStatus, paymentMethod, dueDate, totalQuantity, totalPrice, paid, description, customer) {
    let trans = null;
    try {
        trans = await new Transaction({
            employeeId,
            companyId,
            productItems,
            type,
            paymentStatus,
            paymentMethod,
            dueDate,
            totalQuantity,
            totalPrice,
            paid,
            description,
            customer,
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
        trans = await Transaction.update(
            {_id: _id},
            {$addToSet: {paid: paid}, dueDate: dueDate, description: description}
        );
        return await Transaction
            .findOne({_id: trans._id})
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
        return Transaction.find({_id: _id}).exec();
    } catch (e) {
        throw e;
    }
}