import Router from "router";
import {getInventoryActivity} from "../../../controllers/inventoryActivity";
import {InventoryActivity} from "../../../models/InventoryActivity";
import {Ingredient} from "../../../models/ingredient";
import {Product} from "../../../models/product";
import {Inventory} from "../../../models/inventory";
import * as _ from "lodash";
import {currentCompany} from "../../../controllers/accessToken";

const inventoryActivity = Router();

inventoryActivity.get("/getImport", async (req, res, next) => {
    try {
        let result = await getInventoryActivity();
        res.statusCode = 200;
        res.end(JSON.stringify(result));
    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: e.message}}));
    }
});


inventoryActivity.get("/pos/product", async (req, res, next) => {
    try {
        let { employeeId } = req.query,
            promise = [],
            result = [];
        let inventoryAction = await InventoryActivity.findOne({employeeId, type: "product"}).exec();
        if(inventoryAction) {
            for(let product of inventoryAction.productItems) {
                promise.push(new Promise(async (resolve, reject) => {
                    let getProduct = await Product.findOne({_id: product.productId}).exec();
                    getProduct = getProduct.toJSON();
                    getProduct.quantity = product.quantity;
                    result.push(getProduct);
                    resolve();
                }))
            }
            await Promise.all(promise);
            res.statusCode = 200;
            return res.end(JSON.stringify(result));
        }
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Không có dữ liệu"}}));
    } catch(e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: e.message}}));
    }
});

inventoryActivity.get("/pos/ingredient", async (req, res, next) => {
    try {
        let { employeeId } = req.query,
            promise = [],
            result = [];
        let inventoryAction = await InventoryActivity.findOne({employeeId, type: "ingredient"}).exec();
        if(inventoryAction) {
            for(let ingredient of inventoryAction.ingredient) {
                promise.push(new Promise(async (resolve, reject) => {
                    let getIngredient = await Ingredient.findOne({_id: ingredient.ingredientId}).exec();
                    getIngredient = getIngredient.toJSON();
                    getIngredient.quantity = ingredient.quantity;
                    result.push(getIngredient);
                    resolve();
                }))
            }
            await Promise.all(promise);
            res.statusCode = 200;
            return res.end(JSON.stringify(result));
        }
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Không có dữ liệu"}}));
    } catch(e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: e.message}}));
    }
});

inventoryActivity.post('/accept/delivery/product', async (req, res, next) => {
    try {
        let { employeeId } = req.body,
            promise = [],
            result = [];
        let inventoryAction = await InventoryActivity.findOne({employeeId, type: "product"}).exec(),
            companyInventory = await Inventory.findOne({companyId: req.companyId}).exec();
        if(inventoryAction) {
            for(let product of inventoryAction.productItems) {
                let companyProduct = _.find(companyInventory.productItems, item => item.productId === product.productId),
                    restQuantity = product.quantity > companyProduct.quantity ? companyProduct.quantity : product.quantity;
                result.push({
                    productId: companyProduct.productId,
                    quantity: restQuantity
                });
                promise.push(new Promise(async (resolve, reject) => {
                    await Inventory.update({companyId: req.companyId}, {$pull: {productItems: {
                        productId: product.productId
                    }}}).exec();
                    await Inventory.update({companyId: req.companyId}, {$push: {productItems: {
                        productId: product.productId,
                        quantity: companyProduct.quantity - restQuantity
                    }}}).exec();
                    resolve();
                }))
            }
            await Promise.all(promise);
            await InventoryActivity.update({employeeId, type: "product"}, {$set: {productItems: result, delivering: true}}).exec();
            res.statusCode = 200;
            res.end(JSON.stringify({success: true}));
        }
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Không có dữ liệu"}}));
    } catch(e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: e.message}}));
    }
});

inventoryActivity.post('/accept/delivery/ingredient', async (req, res, next) => {
    try {
        let { employeeId } = req.body,
            promise = [],
            result = [];
        let inventoryAction = await InventoryActivity.findOne({employeeId, type: "ingredient"}).exec(),
            companyInventory = await Inventory.findOne({companyId: req.companyId}).exec();
        if(inventoryAction) {
            for(let ingredient of inventoryAction.ingredient) {
                let companyIngredient = _.find(companyInventory.ingredient, item => item.ingredientId === ingredient.ingredientId),
                    restQuantity = ingredient.quantity > companyIngredient.quantity ? companyIngredient.quantity : ingredient.quantity;
                result.push({
                    ingredientId: companyIngredient.ingredientId,
                    quantity: restQuantity
                });
                promise.push(new Promise(async (resolve, reject) => {
                    await Inventory.update({companyId: req.companyId}, {$pull: {ingredient: {
                        ingredientId: ingredient.ingredientId
                    }}}).exec();
                    await Inventory.update({companyId: req.companyId}, {$push: {ingredient: {
                        ingredientId: ingredient.ingredientId,
                        quantity: companyIngredient.quantity - restQuantity
                    }}}).exec();
                    resolve();
                }))
            }
            await Promise.all(promise);
            await InventoryActivity.update({employeeId, type: "ingredient"}, {$set: {ingredient: result, delivering: true}}).exec();
            res.statusCode = 200;
            res.end(JSON.stringify({success: true}));
        }
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Không có dữ liệu"}}));
    } catch(e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: e.message}}));
    }
});

export default inventoryActivity;