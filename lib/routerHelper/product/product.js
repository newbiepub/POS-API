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
        let {name, unit} = req.body;
        if (name && unit) {
            let {description, categoryId, productVariant, producer, quantity} = req.body;
            for (let item of productVariant) {
                item._id = faker.random.uuid();
            }
            let getPrice = [...productVariant];

            let product = await ProductController.createProduct({
                employeeId: req.userId,
                name,
                price: !getPrice.length ? {_id: faker.random.uuid(), name: "default", price: 0} : getPrice,
                unit,
                producer,
                description,
                categoryId
            });

            await Inventory.update({employeeId: req.userId}, {
                $addToSet: {
                    productItems: {
                        productId: product._id,
                        quantity
                    }
                }
            }, {upsert: true}).exec();

            res.statusCode = 200;
            res.end(JSON.stringify({success: true}));
        } else {
            console.log("Cannot Create Product");
            res.statusCode = 500;
            res.end(JSON.stringify({error: {message: "Internal Error"}}));
        }
    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Internal Error"}}));
    }
});

product.post('/update', async (req, res, next) => {
    try {
        let {_id, name, unit} = req.body;
        if (_id && name && unit) {
            let {description, categoryId, productVariant, producer, quantity} = req.body;

            for (let item of productVariant) {
                item._id == undefined ? item._id = faker.random.uuid() : null;
            }

            let getPrice = [...productVariant];

            await ProductController.upsertProduct({
                _id,
                name,
                price: !getPrice.length ? {_id: faker.random.uuid(), name: "default", price: 0} : getPrice,
                unit,
                description,
                producer,
                categoryId
            });

            await Inventory.update({employeeId: req.userId}, {$pull: {productItems: {productId: _id}}}).exec();
            await Inventory.update({employeeId: req.userId}, {
                $addToSet: {
                    productItems: {
                        productId: _id,
                        quantity
                    }
                }
            }, {upsert: true}).exec();

            res.statusCode = 200;
            res.end(JSON.stringify({success: true}));
        } else {
            console.log("Cannot Update Product");
            res.statusCode = 500;
            res.end(JSON.stringify({error: {message: "Internal Error"}}));
        }
    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Internal Error"}}));
    }
});

export default product;