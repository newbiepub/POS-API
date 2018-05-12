import PRODUCT from "../../../product/index";
import {logger} from "../../../../../../utils/helpers";
import INVENTORY_HISTORY from "../../../history/index";

const exportProductToPOS = async (userId = '', employeeId = '', products = [], confirmOption = false) => {
    let promises = [], productData = [], totalQuantity = 0, totalPrice = 0, result = null;

    try {
        for(let data of products) {
            // total prices
            totalPrice += data.salePrice * (+data.quantity);
            // total quantity
            totalQuantity += data.quantity;
        }

        logger('info', "EXPORT PRODUCT POS - ", products);
        logger('info', "TOTAL QUANTITY - ", totalQuantity);
        logger('info', "TOTAL PRICE - ", totalPrice);
        logger('info', "CONFIRM OPTION - ", confirmOption);

        if(!totalQuantity) throw new Error('TOTAL_QUANTITY_EMPTY');

        if(confirmOption) {

        } else {
            let created_at = new Date();
            // Add product to pos inventory
            for(let product of products) {
                promises.push(PRODUCT.ADD_TO_POS(product._id, product.quantity, employeeId, userId, product.salePrice));
            }
            result = await Promise.all(promises);
            logger('success', 'RESULT LENGTH = ', result.length);
            // create company history
            await INVENTORY_HISTORY.CREATE_HISTORY(result, {_id: userId}, {_id: employeeId}, 'export', created_at, created_at);
            // create pos inventory history
            await INVENTORY_HISTORY.CREATE_HISTORY(result, {_id: userId}, {_id: employeeId}, 'import', created_at, created_at);
        }
    } catch (e) {
        throw e;
    }
}

export { exportProductToPOS };