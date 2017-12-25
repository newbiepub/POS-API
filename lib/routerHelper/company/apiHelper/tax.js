import {TaxController} from '../../../controllers/tax';

const Router = require("router");
const tax = Router();

tax.post("/createTax", async (req, res, next) => {
    try {
        let currentTax = await TaxController.currentTax(req.companyId);
        if (req.body.tax != currentTax) {
            let result = await TaxController.createTax({companyId: req.companyId, tax: req.body.tax});
            res.end(JSON.stringify(result));
        } else {
            res.end(JSON.stringify({error: {message: "Bạn phải nhập thuế khác với thuế hiện tại !"}}));
        }

    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Đã có lỗi xảy ra"}}));
    }
});
tax.get("/currentTax", async (req, res, next) => {
    try {
        let currentTax = await TaxController.currentTax(req.companyId);
        res.end(JSON.stringify(currentTax));

    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Đã có lỗi xảy ra"}}));
    }
})
tax.get("/getTaxHistory", async (req, res, next) => {
    try {
        let tax = await TaxController.getTaxHistory(req.companyId);
        res.end(JSON.stringify(tax));

    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Đã có lỗi xảy ra"}}));
    }
})
export default tax;