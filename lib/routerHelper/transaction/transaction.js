import {getPaymentMethod} from '../../controllers/paymentMethod';
import {getPaymentStatus} from '../../controllers/paymentStatus';
import {getUserId, currentCompany} from '../../controllers/accessToken';
import {subtractProductQuantityInInventory} from '../../controllers/inventory';
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
    // console.log(transactionAmount);
    res.end(JSON.stringify(transactionAmount));

});
transaction.post("/createTransaction", async (req, res, next) => {
    let accesstoken = req.query.access_token;
    let {productItems,tax,paymentMethod,paymentStatus,description,totalPrice,type}= req.body.transaction;
    let employeeId = await getUserId(accesstoken);
    let companyId = await currentCompany(accesstoken);
    productItems.forEach(item =>{
        if(!item.hasOwnProperty("customAmount"))
        {
            subtractProductQuantityInInventory(employeeId,item._id,item.quantity)
        }

    })

    let result = await transactionController.createTransaction({
        productItems: req.body.transaction.productItems,
        companyId: companyId._id,
        employeeId: employeeId,
        date: new Date(),
        tax: req.body.transaction.tax,
        paymentMethod: req.body.transaction.paymentMethod,
        paymentStatus: req.body.transaction.paymentStatus,
        description: req.body.transaction.description,
        totalPrice: req.body.transaction.totalPrice,
        type: req.body.transaction.type,
    })
    console.log(result._id);
    res.end(JSON.stringify(result._id));
});

transaction.post("/issueRefund", async (req, res, next) => {
    let id = req.body.refund._id;
    console.log(req.body.refund.issue_refund)
    let result = await transactionController.upsertTransaction(id, {
        issue_refund: {
            amount: req.body.refund.issue_refund.amount,
            reason: req.body.refund.issue_refund.reason,
        }
    });
     console.log(result);
    res.end(JSON.stringify(result));
});
transaction.get("/commitPurchase", async (req, res, next) => {
    let id = req.query.id;
    let result = await transactionController.upsertTransaction(id, {
            paymentStatus: "Đã Thanh Toán"
        })
    ;
    // console.log(result);
    res.end(JSON.stringify(result));
})
transaction.get("/getTransaction", async (req, res, next) => {
    let accesstoken = req.query.access_token;
    let limit = parseInt(req.query.limit), skip = parseInt(req.query.skip);
    let employeeId = await getUserId(accesstoken);
    let transaction = await transactionController.getTransaction(employeeId, limit, skip);
    //console.log(transaction);
    res.end(JSON.stringify(transaction));
})
export default transaction;