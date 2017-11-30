import {ProductController} from "../../controllers/product";
import CategoryController from '../../controllers/category';
import {getUserId} from '../../controllers/accessToken';

const Router = require("router");
const product = Router();

product.get("/getProduct", async (req, res, next) => {
    //console.log(req.query.access_token)
    let accesstoken = req.query.access_token;
    let id = await getUserId(accesstoken);
    let product = await ProductController.getProduct(id);
  //  let category = await CategoryController.getCategory(id);

    res.end(JSON.stringify(product));


});

export default product;