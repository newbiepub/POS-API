import Router from "router";
import {checkCompanyAuth} from "../../controllers/accessToken";
import account from "./apiHelper/account";
import employee from "./apiHelper/employee";
import product from "./apiHelper/product";
import category from "./apiHelper/category";
import tax from './apiHelper/tax';
import employeeInventory from "./apiHelper/employeeInventory";
import inventory from "./apiHelper/companyInventory";
import discount from './apiHelper/discount';
import inventoryActivity from "./apiHelper/inventoryActivity";
import transaction from './apiHelper/transaction';

const api = Router();

api.use(async (req, res, next) => {
    res.setHeader("Content-Type", 'application/json');
    try {
        let access_token = req.query.access_token || req.body.access_token || req.headers["access-token"];
        if (access_token) {
            let token = await checkCompanyAuth({access_token});
            if (token) {
                req.companyId = token.companyId;
                return next();
            }
        }
        throw new Error("Token unhandled");
    } catch (e) {
        res.statusCode = 401;
        res.end(JSON.stringify({error: {message: "Unauthorized"}}))
    }
});

api.use("/account", account);

api.use("/employee", employee);

api.use("/product", product);

api.use("/discount", discount);

api.use('/category', category);

api.use('/transaction', transaction);

api.use('/tax', tax);

api.use('/inventory', inventory);

api.use("/management", employeeInventory);

api.use("/inventoryActivity", inventoryActivity);

export default api;