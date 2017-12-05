import {Transaction} from "../models/transaction";
class transactionController {
    static async getTransaction(id,limit,skip) {
        return await Transaction.find({"employeeId": id}).limit(limit).skip(skip).exec();
    }

    static async createTransaction(transaction) {
        try{
            return await new Transaction(transaction).save();
        }catch(e)
        {
            throw(e)
        }
    }

}

export {transactionController};