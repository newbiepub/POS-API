/**
 * Get query
 */
import {InventoryHistory} from "../../../../models/modelConfigs";
import {logger} from "../../../../../utils/helpers";

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