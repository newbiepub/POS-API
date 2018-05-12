import {InventoryActivity, InventoryActivityLogger, ProductInventory} from "../../../../../models/modelConfigs";
import {logger} from "../../../../../../utils/helpers";

export const createInventoryOrder = async (companyId, employeeId, products = [], activityId) => {
    try {
        let promises = [], totalQuantity = 0, totalPrice = 0, errorItems = [];

        [totalQuantity, totalPrice] = await products.reduce( async (result, product) => {
            result = await result;
            // total prices
            result[1] += product.salePrice * (+product.quantity);
            // total quantity
            result[0] += product.quantity;
            return result;
        }, [totalQuantity, totalPrice]);

        // Create inventory contract
        promises = products.map(async (product) => {
            try {
                return await ProductInventory.update({
                    product: product._id,
                    companyId
                }, {
                    $inc: {quantity: -product.quantity}
                }).exec();
            } catch (e) {
                logger('error - ', e.message);
                logger('stack - ', e.stack);
                errorItems.push(product);
            }
        })
        await Promise.all(promises);
        // Update pending activity
        try {
            let updateItems = {
                products,
                totalQuantity,
                totalPrice,
                from: {_id: companyId},
                to: {_id: employeeId},
                status: 'processing',
                dateDelivered: new Date(),
                type: 'posImport'
            }
            logger('info', 'create order - ', updateItems);
            if(!!activityId) {
                await InventoryActivity.findOneAndUpdate({
                    _id: activityId
                }, {
                    $set: updateItems
                }, {
                    upsert: true
                }).exec()
            } else {
                // Create new one from company
                await new InventoryActivity({
                    ...updateItems,
                    dateRequest: updateItems.dateDelivered
                }).save();
            }
            // Write log error items
            errorItems.length > 0 && await InventoryActivityLogger({
                message: 'ERROR_CREATE_CONSTRACT',
                data: JSON.stringify(errorItems),
                companyId,
                employeeId,
                type: 'logger_error_export_product_to_POS'
            })
            logger('success', 'create order successfully');
        }
        catch(e) {
            logger('error - ', e.message);
            logger('stack - ', e.stack);
        }
    } catch (e) {
        throw e;
    }
}