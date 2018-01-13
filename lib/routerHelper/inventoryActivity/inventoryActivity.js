import Router from "router";
import {createImport, createIngredientImport, createProductImport} from "../../controllers/inventoryActivity";
import {InventoryActivity} from "../../models/InventoryActivity";
import {Inventory} from "../../models/inventory";
import * as _ from "lodash";

const inventoryActivity = Router();

inventoryActivity.post("/pos/import/product", async (req, res, next) => {
    try {
        let {exportProduct} = req.body;
        if (exportProduct.length) {
            await createImport({
                employeeId: req.userId,
                productItems: exportProduct,
                processing: true,
                delivering: false,
                done: false,
                activity: "Nhập Kho",
                type: "product",
                createdAt: new Date()
            })
        }
        res.statusCode = 200;
        res.end(JSON.stringify({success: true}))
    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: e.message}}));
    }
});

inventoryActivity.post("/pos/import/ingredient", async (req, res, next) => {
    try {
        let {exportIngredient} = req.body;
        if (exportIngredient.length) {
            await createImport({
                employeeId: req.userId,
                ingredient: exportIngredient,
                processing: true,
                delivering: false,
                done: false,
                activity: "Nhập Kho",
                type: "ingredient",
                createdAt: new Date()
            })
        }
        res.statusCode = 200;
        res.end(JSON.stringify({success: true}))
    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: e.message}}));
    }
});

inventoryActivity.post("/pos/accept/delivery", async (req, res, next) => {
    try {
        let inventoryActivity = await InventoryActivity.findOne({employeeId: req.userId}).exec(),
            employeeInventory = await Inventory.findOne({employeeId: req.userId}).exec(),
            promise = [];
        _.each(inventoryActivity.productItems, (item) => {
            promise.push(new Promise(async (resolve, reject) => {
                let product = _.find(employeeInventory.productItems, i => i.productId === item.productId);
                if (product) {
                    product.quantity += item.quantity;
                    await Inventory.update({employeeId: req.userId}, {$pull: {productItems: {productId: item.productId}}}).exec();
                    await Inventory.update({employeeId: req.userId}, {
                        $push: {
                            productItems: {
                                productId: item.productId,
                                quantity: product.quantity
                            }
                        }
                    }).exec();
                } else {
                    await Inventory.update({employeeId: req.userId}, {
                        $push: {
                            productItems: {
                                productId: item.productId,
                                quantity: item.quantity
                            }
                        }
                    }).exec();
                }
                resolve();
            }))
        });
        _.each(inventoryActivity.ingredient, (item) => {
            promise.push(new Promise(async (resolve, reject) => {
                let ingredient = _.find(employeeInventory.ingredient, i => i.ingredientId === item.ingredientId);
                if (ingredient) {
                    ingredient.quantity += item.quantity;
                    await Inventory.update({employeeId: req.userId}, {$pull: {ingredient: {ingredientId: item.ingredientId}}}).exec();
                    await Inventory.update({employeeId: req.userId}, {
                        $push: {
                            ingredient: {
                                ingredientId: item.ingredientId,
                                quantity: ingredient.quantity
                            }
                        }
                    }).exec();
                } else {
                    await Inventory.update({employeeId: req.userId}, {
                        $push: {
                            ingredient: {
                                ingredientId: item.productId,
                                quantity: item.quantity
                            }
                        }
                    }).exec();
                }
                resolve();
            }))
        });
        await InventoryActivity.update({employeeId: req.userId}, {$set: {done: true}}).exec();
        await Promise.all(promise);
        res.statusCode = 200;
        res.end(JSON.stringify({success: true}));
    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: e.message}}));
    }
});

inventoryActivity.get("/pos/check/delivery", async (req, res, next) => {
    try {
        let activity = await InventoryActivity.findOne({
            employeeId: req.userId,
            $and: [{delivering: true}, {done: false}, {processing: true}]
        }).exec();
        if (activity) {
            return res.end(JSON.stringify({check: true}))
        }
        res.end(JSON.stringify({check: false}))
    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: e.message}}));
    }
})

export default inventoryActivity;