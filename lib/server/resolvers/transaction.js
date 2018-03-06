import {Transaction} from "../models/modelConfigs";

export async function createTransaction(employeeId, companyId, productItems, type, paymentStatus, paymentMethod, dueDate, totalQuantity, totalPrice, paid, description, customer, date) {
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
            date
        }).save();
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