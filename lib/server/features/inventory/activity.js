import {InventoryActivity, Product, ProductInventory, InventoryHistory} from "../../models/modelConfigs";
import {createInventoryHistory} from "../../resolvers/inventoryActivity";
import {logger} from "../../../utils/helpers";
import PRODUCT from "./product/index";

/**
 * Mutations
 */

/**
 * Inventory Order
 * @param userId
 * @param employeeId
 * @param products
 * @param totalPrice
 * @param totalQuantity
 * @returns {Promise.<void>}
 */
async function createInventoryOrder(userId = '',
                                    employeeId = '',
                                    products = [],
                                    totalPrice = 0,
                                    totalQuantity = 0,
                                    fromPOS = false) {
    try {
        let status = fromPOS ? 'pending' : 'processing';
        let dateDelivered = fromPOS ? null : new Date();

        return await new InventoryActivity({
            products,
            totalQuantity,
            totalPrice,
            type: 'posImport',
            from: {
                _id: userId
            },
            to: {
                _id: employeeId
            },
            status: 'processing',
            dateRequest: new Date(),
            dateDelivered: dateDelivered,
            dateReceived: null
        }).save();
    } catch (e) {
        console.error(e.message);
        throw new Error("INTERNAL_SERVER_ERROR");
    }
}

/**
 * Get query
 */

export async function getInventoryHistory(userId, type) {
    try {
        let query = {type: type}, inventoryHistory = null;

        if(type === "import") {
            query = {'to._id': userId, ...query}
        } else if(type === "export") {
            query = {'from._id': userId, ...query};
        }

        inventoryHistory = await InventoryHistory.find(query).exec();
        logger('success', 'INVENTORY HISTORY - ', inventoryHistory.length);
        return inventoryHistory;
    } catch (e) {
        throw e;
    }
}