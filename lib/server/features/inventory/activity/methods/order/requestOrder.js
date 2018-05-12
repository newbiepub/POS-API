import {InventoryActivity, User} from "../../../../../models/modelConfigs";
import {logger} from "../../../../../../utils/helpers";

export const requestOrder = async (employeeId, products) => {
    try {
        let company, totalQuantity = 0, updateItems, activity;

        company       = await User.findOne({_id: employeeId}).exec();
        products      = products.map(item => ({_id: item._id, quantity: item.quantity}));
        logger('info', 'product data - ', products);
        totalQuantity = products.reduce((result, product) => result + product.quantity,0);
        logger('info', 'total quantity - ', totalQuantity);
        updateItems   = {
            products,
            totalQuantity,
            from: {_id: company._id},
            to: {_id: employeeId},
            status: 'pending',
            dateRequest: new Date(),
            type: 'posImport'
        }
        logger('update items - ',  updateItems);
        activity = await new InventoryActivity(updateItems).save();
        return logger('success', 'created actitivy - ', activity._id);
    } catch (e) {
        logger('error', 'error - ', e.message);
        logger('error', 'stack - ', e.stack);
        throw e;
    }
}