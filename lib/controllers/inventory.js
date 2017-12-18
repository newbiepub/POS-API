import {Inventory} from "../models/inventory";
import {Product} from "../models/product";
import {Ingredient} from "../models/ingredient";

export async function getInventoryProduct(employeeId) {
    try {
        let inventory = await Inventory.findOne({employeeId}).exec();
        if (inventory) {
            let productItems = inventory.productItems || [],
                result = [];
            for (let product of productItems) {
                let productItem = await Product.findOne({
                    _id: product.productId,
                    productVariantParent: {$exists: false}
                }, {name: true, price: true, unit: true}).exec();

                if (productItem) {
                    productItem = productItem.toJSON();
                    productItem.quantity = product.quantity;
                    result.push(productItem);
                }
            }
            return result;
        }
        throw new Error("Inventory not found");
    } catch (e) {
        throw e;
    }
}

export async function getInventoryIngredient(employeeId) {
    try {
        let inventory = await Inventory.findOne({employeeId}).exec();
        if(inventory) {
            let ingredients = inventory.ingredient || [],
                result = [];
            for (let ingredient of ingredients) {
                let item = await Ingredient.findOne({
                    _id: ingredient.ingredientId
                }).exec();

                if(item) {
                    item = item.toJSON();
                    item.quantity = ingredient.quantity;
                    result.push(item);
                }
            }
            return result;
        }
        throw new Error("Inventory not found");
    } catch(e) {
        throw e;
    }
}