import {Transaction} from "../models/transaction";

class transactionController {
    static async getTransaction(id, limit, skip) {
        try {
            return await Transaction.find({"employeeId": id}).limit(limit).skip(skip).sort({"date": -1}).exec();
        }
        catch (e) {
            throw(e)
        }
    }

    static async countTransaction(id) {
        try {
            return await Transaction.find({"employeeId": id}).count().exec();
        }
        catch (e) {
            throw(e)
        }
    }
    static async issueRefund(id,transaction) {
        try {
            return await Transaction.findOneAndUpdate({_id: id}, {$set: transaction}, {multi: true, upsert: true});
        }
        catch (e) {
            throw(e)
        }
    }
    static async createTransaction(transaction) {
        try {
            return await new Transaction(transaction).save();
        } catch (e) {
            throw(e)
        }
    }

}

export {transactionController};