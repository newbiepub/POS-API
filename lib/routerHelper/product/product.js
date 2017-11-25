import {ProductController} from "../../controllers/product";

const Router = require("router");
const product = Router();

product.get("/", async (req, res, next) => {
    let limit = +req.query.limit || 0,
        skip = +req.query.skip || 0;
    let product = await ProductController.getProduct(limit, skip);
    res.end(JSON.stringify(product));
});

export default product;