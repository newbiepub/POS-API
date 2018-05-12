import {InventoryActivity, ProductInventory} from "../../../../../models/modelConfigs";
import {logger} from "../../../../../../utils/helpers";
import passwordHash from 'password-hash';

export const revertOrder = async (activityId, companyId, companyPassword, password) => {
    try {
        let activity, products = [], promises = [], checkPassword;

        checkPassword = passwordHash.verify(password, companyPassword)
        activity = await InventoryActivity.findOne({_id: activityId, status: 'processing'}).exec();
        logger('info', 'current activity - ', activity);
        logger('info', 'check password - ', checkPassword);
        if(!checkPassword) throw new Error('REVERT_AUTHENTICATED_FAILED');
        if(!activity) throw new Error('CANNOT_REVERT_ORDER');

        products = activity.products || [];
        promises = products.map((product) => new Promise(async (resolve, reject) => {
            try {
                await ProductInventory.update({
                    product: product._id,
                    companyId
                }, {
                    $inc: {quantity: +product.quantity}
                }).exec();
            } catch (e) {
                logger('error', 'error - ', e.message);
                logger('error', 'stack - ', e.stack);
            }
            resolve();
        }));
        await Promise.all(promises);
        activity = await InventoryActivity.findOneAndRemove({_id: activity._id}).exec();
        logger('success', 'Done reverted - ', activity._id);
    } catch (e) {
        throw e;
    }
}