import {logger} from "../../../../../../utils/helpers";
import {InventoryActivity, InventoryHistory, ProductInventory, User} from "../../../../../models/modelConfigs";
import {normalize_inventory_history_products} from "../../../../../../utils/normalizeData/history";
import {createInventoryHistory} from "../../../history/methods/create";

export const confirmOrder = async (activityId, employeeId) => {
    try {
        let activity, productData, products = [], promises, populate, history,
            company = await User.findOne({_id: employeeId}).exec();
        let companyId = company.companyId;
        populate = {
            path: "product",
            model: "product",
            populate: [
                {
                    path: "categoryId",
                    model: "category"
                }
            ]
        };
        activity = await InventoryActivity.findOne({_id: activityId}).exec();
        products = activity.products || [];
        logger('info', 'products update - ', products);
        promises = products.map(product => new Promise(async (resolve, reject) => {
            try {
                let salePrice = {
                    name: 'default',
                    price: product.salePrice
                }
                // Remove old price
                await ProductInventory.update({
                    product: product._id,
                    employeeId
                }, {
                    $pull: {
                        prices: {
                            name: 'default'
                        }
                    }
                })
                // Update new price
                await ProductInventory.findOneAndUpdate({
                    product: product._id,
                    employeeId
                }, {
                    $inc: {quantity: +product.quantity},
                    $push: {prices: salePrice}
                }, {new: true, upsert: true}).populate([populate]).exec();
            }
            catch (e) {
                logger('error', 'error - ', e.message);
            }
            resolve();
        }));
        productData = await Promise.all(promises);

        // productData = productData.map(normalize_inventory_history_products);
        logger('info', 'data history - ', productData);
        // history = await createInventoryHistory(productData, {_id: companyId}, {_id: employeeId}, 'export', activity.dateDelivered, new Date());
        // await InventoryActivity.update({_id: activityId}, {$set: {dateReceived: new Date(), status: 'done'}}).exec();
    } catch (e) {
        logger('error - ', e.message);
        logger('error - ', e.stack);
        throw e;
    }
}