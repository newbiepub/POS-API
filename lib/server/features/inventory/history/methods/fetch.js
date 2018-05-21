/**
 * Get query
 */
import {InventoryHistory, User} from "../../../../models/modelConfigs";
import {logger} from "../../../../../utils/helpers";

export async function getInventoryHistory(userId, type) {
    try {
        let query = {type: type}, inventoryHistory = null, promises = [];

        if(type === "import") {
            query = {'to._id': userId, ...query}
        } else if(type === "export") {
            query = {'from._id': userId, ...query};
        }

        inventoryHistory = await InventoryHistory.find(query).exec();
        promises = inventoryHistory.map(history => new Promise(async (resolve, reject) => {
            history = history.toJSON();
            let [from, to] = await Promise.all([
                User.findOne({_id: history.from._id}).exec(),
                User.findOne({_id: history.to._id}).exec()
            ]);
            if(from != undefined) {
                Object.assign(history.from, {
                    name: from.profile.name
                })
            }
            if(to != undefined) {
                Object.assign(history.to, {
                    name: to.profile.name
                })
            }
            resolve(history);
        }))
        inventoryHistory = await Promise.all(promises);
        logger('success', 'INVENTORY HISTORY - ', inventoryHistory.length);
        return inventoryHistory;
    } catch (e) {
        throw e;
    }
}