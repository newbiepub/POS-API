
import {transactionController} from '../../../controllers/transaction';
const Router = require("router");
const transaction = Router();

transaction.get("/getTransaction", async (req, res, next) => {
    let limit = parseInt(req.query.limit), skip = parseInt(req.query.skip);
    let transaction = await transactionController.getTransactionForCompany(req.companyId, limit, skip);
    console.log(transaction);
    res.end(JSON.stringify(transaction));
})

transaction.get("/countTransaction", async (req, res, next) => {
    let transaction = await transactionController.countTransactionForCompany(req.companyId);
    //console.log(transaction);
    res.end(JSON.stringify(transaction));
})

export default transaction;