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

product.post("/create", async (req, res, next) => {
    try {
        let { employeeId, name, price, unit } = req. body;
        if(employeeId && name && price && unit) {
            let { description, categoryId, productVariant } = req.body;
            let product = await ProductController.createProduct({
                employeeId: req.userId,
                name,
                price,
                unit,
                description,
                categoryId
            });
            for(let item of productVariant) {
                await ProductController.createProduct({
                    employeeId: req.userId,
                    name: item.name,
                    price: item.price,
                    unit,
                    productVariantParent: product._id
                })
            }
            res.statusCode = 200;
            res.end(JSON.stringify({success: true}));
        } else {
            console.log("Cannot Create Product");
            res.statusCode = 500;
            res.end(JSON.stringify({error: {message: "Internal Error"}}));
        }
    } catch(e) {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Internal Error"}}));
    }
});

export default product;