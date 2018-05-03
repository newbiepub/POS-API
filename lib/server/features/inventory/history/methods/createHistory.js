import {logger} from "../../../../../utils/helpers";
import Exception from "../../../../constants/errorStatus";
import {InventoryHistory} from "../../../../models/modelConfigs";

const createInventoryHistory = async (products = [], from = null, to = null, type = '',
                                      dateDelivered = null, dateReceived = null) => {
    try {
        let { totalQuantity, totalPrice } = products.reduce((total, product) => {
            total.totalPrice    += product.importPrice;
            total.totalQuantity += product.quantity;
            return total;
        }, {totalQuantity: 0, totalPrice: 0});
        logger('info', 'CREATING INVENTORY HISTORY...');
        let res = await new InventoryHistory({
            products, totalQuantity, totalPrice,
            type, from, to, dateDelivered, dateReceived
        }).save();
        logger('success', 'DONE INVENTORY HISTORY - ', res._id);
    } catch (e) {
        logger('error', e.message);
        return Exception.CANNOT_CREATE_INVENTORY_HISTORY;
    }
}

export {createInventoryHistory};