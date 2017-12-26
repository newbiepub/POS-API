import {Inventory} from "../models/inventory";
import {Product} from "../models/product";
import {Ingredient} from "../models/ingredient";
import {getCurrentEmployee} from "./employee";
import * as _ from "lodash";
import {Company} from "../models/company";

export async function getInventoryProduct(employeeId) {
    try {
        let inventory = await Inventory.findOne({employeeId}).exec();
        if (inventory) {
            let productItems = inventory.productItems || [],
                result = [],
                promise = [];
            for (let product of productItems) {
                promise.push(new Promise(async (resolve, reject) => {
                    let productItem = await Product.findOne({_id: product.productId}, {
                        name: true,
                        price: true,
                        unit: true
                    }).exec();

                    if (productItem) {
                        productItem = productItem.toJSON();
                        productItem.quantity = product.quantity;
                        result.push(productItem);
                    }
                    resolve();
                }))
            }
            await Promise.all(promise);
            return result;
        }
        throw new Error("Inventory not found");
    } catch (e) {
        throw e;
    }
}

export async function getCompanyInventoryProduct(companyId) {
    try {
        let inventory = await Inventory.findOne({companyId}).exec();
        if (inventory) {
            let productItems = inventory.productItems || [],
                result = [],
                promise = [];
            for (let product of productItems) {
                promise.push(new Promise(async (resolve, reject) => {
                    let productItem = await Product.findOne({_id: product.productId}, {
                        name: true,
                        price: true,
                        unit: true
                    }).exec();

                    if (productItem) {
                        productItem = productItem.toJSON();
                        productItem.quantity = product.quantity;
                        result.push(productItem);
                    }
                    resolve();
                }))
            }
            await Promise.all(promise);
            return result;
        }
        throw new Error("Inventory not found");
    } catch (e) {
        throw e;
    }
}


export async function getInventoryIngredient(employeeId) {
    try {
        let currentEmployee = await getCurrentEmployee(employeeId);
        let result = await Promise.all([
            Inventory.findOne({employeeId}).exec(),
            Inventory.findOne({companyId: currentEmployee.companyId}).exec()
        ]);

        let employeeInventory = result[0],
            companyInventory = result[1],
            employeeIngredient = employeeInventory.ingredient || [];

        if (companyInventory) {
            let ingredients = companyInventory.ingredient || [],
                result = [],
                promise = [];
            for (let ingredient of ingredients) {
                promise.push(new Promise(async (resolve, reject) => {
                    let item = await Ingredient.findOne({
                        _id: ingredient.ingredientId
                    }).exec();

                    let currentIngredient = _.find(employeeIngredient, (item) => item.ingredientId === item._id) || {};
                    let quantity = currentIngredient.quantity || 0;

                    if (item) {
                        item = item.toJSON();
                        item.quantity = quantity;
                        result.push(item);
                    }
                    resolve();
                }))
            }
            await Promise.all(promise);
            return result;
        }
        throw new Error("Inventory not found");
    } catch (e) {
        throw e;
    }
}

export async function getCompanyInventoryIngredient(companyId) {
    try {
        let inventory = await Inventory.findOne({companyId}).exec();
        if (inventory) {
            let ingredients = inventory.ingredient || [],
                result = [];
            for (let ingredient of ingredients) {
                let item = await Ingredient.findOne({
                    _id: ingredient.ingredientId
                }).exec();

                if (item) {
                    item = item.toJSON();
                    item.quantity = ingredient.quantity;
                    result.push(item);
                }
            }
            return result;
        }
        throw new Error("Inventory not found");
    } catch (e) {
        throw e;
    }
}


export async function subtractProductQuantityInInventory(employeeId, productId, number) {
    try {
        let product = await Inventory.findOne({"employeeId": employeeId}, {productItems: {$elemMatch: {productId: productId}}}).exec();

        let quantity = product.productItems[0].quantity - number;
        await Inventory.update({employeeId}, {$pull: {productItems: {productId: productId}}}).exec();
        await Inventory.update({employeeId}, {$addToSet: {productItems: {productId: productId, quantity}}}).exec();
    } catch (e) {
        throw(e)
    }
}

// Get POS Employee

export async function getPOSInventory(employeeId) {
    try {
        let inventory = await Inventory.findOne({employeeId}).exec();
        return inventory;
    } catch (e) {
        throw e;
    }
}

export async function getCompanyProduct(employeeId) {
    try {
        let currentEmployee = await getCurrentEmployee(employeeId);
        let result = await Promise.all([
            Inventory.findOne({companyId: currentEmployee.companyId}).exec(),
            Company.findOne({_id: currentEmployee.companyId}).exec()
        ]),
            inventory = result[0],
            company = result[1],
            promise = [],
            output = [];
        let productItems = inventory.productItems || [];
        for(let item of productItems) {
            promise.push(new Promise(async (resolve, reject) => {
                let getProduct = await Product.findOne({_id: item.productId}).exec();
                if(getProduct) {
                    getProduct = getProduct.toJSON();

                    getProduct.quantity = company.settings.exportInventoryProductQuantity <= item.quantity ? company.settings.exportInventoryProductQuantity : item.quantity;

                    output.push(getProduct);
                }
                resolve();
            }))
        }
        await Promise.all(promise);
        return output;
    } catch (e) {
        throw e;
    }
}

export async function getCompanyIngredient(employeeId) {
    try {
        let currentEmployee = await getCurrentEmployee(employeeId);
        let result = await Promise.all([
                Inventory.findOne({companyId: currentEmployee.companyId}).exec(),
                Company.findOne({_id: currentEmployee.companyId}).exec()
            ]),
            inventory = result[0],
            company = result[1],
            promise = [],
            output = [];
        let ingredient = inventory.ingredient || [];
        for(let item of ingredient) {
            promise.push(new Promise(async (resolve, reject) => {
                let getIngredient = await Ingredient.findOne({_id: item.ingredientId}).exec();
                if(getIngredient) {
                    getIngredient = getIngredient.toJSON();

                    getIngredient.quantity = company.settings.exportInventoryIngredientQuantity <= item.quantity ? company.settings.exportInventoryIngredientQuantity : item.quantity;

                    output.push(getIngredient);
                }
                resolve();
            }))
        }
        await Promise.all(promise);
        return output;
    } catch (e) {
        throw e;
    }
}