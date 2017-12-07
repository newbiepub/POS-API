import {getPaymentMethod} from '../../controllers/paymentMethod';
import {getPaymentStatus} from '../../controllers/paymentStatus';
import {getUserId, currentCompany} from '../../controllers/accessToken'
import {transactionController} from '../../controllers/transaction';

const Router = require("router");
const transaction = Router();

transaction.get("/getPaymentMethod", async (req, res, next) => {
    let accesstoken = req.query.access_token;
    let id = await getUserId(accesstoken);
    let paymentMethod = await getPaymentMethod(id);
    res.end(JSON.stringify(paymentMethod));

});
transaction.get("/getPaymentStatus", async (req, res, next) => {
    let accesstoken = req.query.access_token;
    let id = await getUserId(accesstoken);
    let paymentStatus = await getPaymentStatus(id);
    res.end(JSON.stringify(paymentStatus));

});
transaction.get("/countTransaction", async (req, res, next) => {
    let accesstoken = req.query.access_token;
    let id = await getUserId(accesstoken);
    let transactionAmount = await transactionController.countTransaction(id);
    console.log(transactionAmount);
    res.end(JSON.stringify(transactionAmount));

});
transaction.post("/createTransaction", async (req, res, next) => {
    let accesstoken = req.query.access_token;
    let employeeId = await getUserId(accesstoken);
    let companyId = await currentCompany(accesstoken);
    let result = await transactionController.createTransaction({
        productItems: req.body.transaction.productItems,
        companyId: companyId._id,
        employeeId: employeeId,
        date: new Date(),
        paymentMethod: req.body.transaction.paymentMethod,
        paymentStatus: req.body.transaction.paymentStatus,
        description: req.body.transaction.description,
        totalPrice: req.body.transaction.totalPrice,
        type: req.body.transaction.type,
    })
    console.log(result._id);
    res.end(JSON.stringify(result._id));
});

transaction.get("/getTransaction", async (req, res, next) => {
    let accesstoken = req.query.access_token;
    let limit = parseInt(req.query.limit), skip = parseInt(req.query.skip);
    let employeeId = await getUserId(accesstoken);
    let transaction = await transactionController.getTransaction(employeeId, limit, skip);
    //console.log(transaction);
    res.end(JSON.stringify(transaction));
})
export default transaction;