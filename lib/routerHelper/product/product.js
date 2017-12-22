import {ProductController} from "../../controllers/product";
import CategoryController from '../../controllers/category';
import {getUserId} from '../../controllers/accessToken';
import {Inventory} from "../../models/inventory";

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
            let product = await ProductController.createProduct({
                employeeId: req.userId,
                name,
                price,
                unit,
                producer,
                description,
                categoryId
            });
            for(let item of productVariant) {
                await ProductController.createProduct({
                    employeeId: req.userId,
                    name: item.name,
                    price: item.price,
                    unit,
                    producer,
                    productVariantParent: product._id
                })
            }

            await Inventory.update({employeeId: req.userId}, {$addToSet: {productItems: {productId: product._id, quantity}}}, {upsert: true});

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

product.post('/update', async (req, res, next) => {
    try {
        let { _id, name, price, unit } = req.body;
        if(_id && name && price && unit) {
            let { description, categoryId, productVariant, producer, quantity } = req.body;
            await ProductController.upsertProduct({
                _id,
                name,
                price,
                unit,
                description,
                producer,
                categoryId
            });
            for(let item of productVariant) {
                await ProductController.upsertProduct({
                    _id: item._id,
                    employeeId: req.userId,
                    name: item.name,
                    price: item.price,
                    unit,
                    producer,
                    productVariantParent: _id
                })
            }

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