import {checkAuthToken} from "../controllers/accessToken";
import product from "./product/product";
import category from "./category/category";

const Router = require("router");
const api = Router();

api.use(async (req, res, next) => {
    try {
        let { access_token } = req.query;
        if(access_token) {
            let token = await checkAuthToken(access_token);
            if(token) {
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

api.use((req, res,next) => {
    res.end("Not Found");
});


export default api;