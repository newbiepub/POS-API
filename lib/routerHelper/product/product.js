import {ProductController} from "../../controllers/product";
const Router = require("router");
const product = Router();
import { currentCompany} from '../../controllers/accessToken';
product.get("/getProduct", async (req, res, next) => {
    let accesstoken = req.query.access_token;
    let {_id} = await currentCompany(accesstoken);
    let product = await ProductController.getProduct(_id);
    res.end(JSON.stringify(product));
});


export default product;