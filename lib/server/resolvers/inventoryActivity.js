import {Ingredient, InventoryHistory, Product, ProductInventory} from "../models/modelConfigs";

// Profile default data
let initialProfileData = {
    name: "",
    phone: "",
    address: "",
    email: "",
    description: ""
};

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

    try {
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

/**
 * Company export products to POS
 * @returns {Promise.<void>}
 */

async function requestExportToPOS (){

}

module.exports = { createInventoryHistory };