import {checkAuthToken} from "../controllers/accessToken";
import product from "./product/product";
import category from "./category/category";
import user from "./user/user";
import transaction from './transaction/transaction';
import discount from './discount/discount';
import inventory from "./inventory/inventory";

const Router = require("router");
const api = Router();

api.use(async (req, res, next) => {
    res.setHeader("Content-Type", 'application/json');
    try {
        let access_token = req.query.access_token || req.body.access_token || req.headers["access-token"];
        if(access_token) {
            let token = await checkAuthToken(access_token);
            if(token) {
                req.userId = token.userId;
                return next();
            }
        }
        console.log("Token unhandled");
        throw new Error("");
    } catch(e) {
        res.statusCode = 401;
        res.end(JSON.stringify({error: {message: "Unauthorized"}}))
    }
});

// API PRODUCT
api.use("/product", product);


// API CATEGORY
api.use("/category", category);

// API DISCOUNT
api.use("/discount", discount);

//API USER
api.use("/user", user);

//API TRANSACTION
api.use("/transaction", transaction);

api.use("/inventory", inventory);

api.use((req, res,next) => {
    res.end("Not Found");
});


export default api;