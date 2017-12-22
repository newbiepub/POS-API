import {ProductController} from "../../controllers/product";
import {getUserId} from '../../controllers/accessToken';
import {Inventory} from "../../models/inventory";
import * as _ from "lodash";
import {Product} from "../../models/product";
import faker from "faker";

const Router = require("router");
const product = Router();

product.get("/getProduct", async (req, res, next) => {
    let accesstoken = req.query.access_token;
    let id = await getUserId(accesstoken);
    let product = await ProductController.getProduct(id);
    res.end(JSON.stringify(product));
});

product.post("/create", async (req, res, next) => {
    try {
        let { name, price, unit } = req. body;
        if(name && price && unit) {
            let { description, categoryId, productVariant, producer, quantity } = req.body;
            for(let item of productVariant) {
                item._id = faker.random.uuid();
            }
            let getPrice = [...productVariant, {name: "default", price: price, _id: faker.random.uuid()}];

            let product = await ProductController.createProduct({
                employeeId: req.userId,
                name,
                price: getPrice,
                unit,
                producer,
                description,
                categoryId
            });

            await Inventory.update({employeeId: req.userId}, {$addToSet: {productItems: {productId: product._id, quantity}}}, {upsert: true});

            res.statusCode = 200;
            res.end(JSON.stringify({success: true}));
        } else {
            console.log("Cannot Create Product");
            res.statusCode = 500;
            res.end(JSON.stringify({error: {message: "Internal Error"}}));
        }
    } catch(e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Internal Error"}}));
    }
});

product.post('/update', async (req, res, next) => {
    try {
        let { _id, name, price, unit } = req.body;
        if(_id && name && price && unit) {
            let { description, categoryId, productVariant, producer, quantity } = req.body,
                currentProduct = await Product.findOne({_id}).exec(),
                getPrice = currentProduct.price;

            await ProductController.upsertProduct({
                _id,
                name,
                price: _.intersectionWith(getPrice, productVariant, _.isEqual),
                unit,
                description,
                producer,
                categoryId
            });


            await Inventory.update({employeeId: req.userId}, {$addToSet: {productItems: {productId: _id, quantity}}}, {upsert: true});

            res.statusCode = 200;
            res.end(JSON.stringify({success: true}));
        } else {
            console.log("Cannot Update Product");
            res.statusCode = 500;
            res.end(JSON.stringify({error: {message: "Internal Error"}}));
        }
    } catch(e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Internal Error"}}));
    }
});

export default product;