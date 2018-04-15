import {Ingredient, InventoryHistory, Product, ProductInventory} from "../models/modelConfigs";
import {logger} from "../../utils/helpers";

// Profile default data
let initialProfileData = {
    name: "",
    phone: "",
    address: "",
    email: "",
    description: ""
};

/**
 * Helpers
 */

async function getProduct (productId, quantity) {
    try {
        let product = await Product.findOne({_id: productId});

        if(product) {
            product = product.toJSON();
            Object.assign(product, {quantity});
            return product;
        }
        return null;
    } catch (e) {
        logger('error', e.message)
    }
}

/**
 * Create Inventory History for each inventory activity
 * @param from
 * @param to
 * @param type
 * @param products
 * @param ingredients
 * @param totalQuantity
 * @param totalPrice
 * @returns {Promise.<*>}
 */
async function createInventoryHistory(from = null, to = null, type, products = null, ingredients = null, totalQuantity, totalPrice) {
    let inventoryHistory = null;
    let currentDate = new Date();
    let promises = products.map(product => getProduct(product._id, product.quantity));

    try {
        products = await Promise.all(promises);
        inventoryHistory = await new InventoryHistory({
            products,
            ingredients,
            from,
            to,
            type,
            totalQuantity,
            totalPrice,
            dateDelivered: currentDate,
            dateReceived: currentDate
        }).save();
    } catch (e) {
        console.log("ERROR - ", e.message);
    }
    return inventoryHistory;
}

module.exports = { createInventoryHistory };