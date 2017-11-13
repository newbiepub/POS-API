import {checkAuthToken} from "../controllers/accessToken";
import product from "./product/product";
import category from "./category/category";
import user from "./user/user";

const Router = require("router");
const api = Router();

api.use(async (req, res, next) => {
    try {
        let { access_token } = req.query;
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

//API USER
api.use("/user", user)

api.use((req, res,next) => {
    res.end("Not Found");
});


export default api;