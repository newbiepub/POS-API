import {logger} from "../../../../../utils/helpers";
import {ProductInventory} from "../../../../models/modelConfigs";
import Exception from "../../../../constants/errorStatus";

const addProductInventory = async (product = null, importPrice = 0, prices = [], description = '',
                                   quantity = 0, employeeId = undefined, companyId = undefined, ) => {
    try {
        logger('info', 'CREATING PRODUCT INVENTORY...')
        let res = await new ProductInventory({
            product,
            importPrice,
            prices,
            quantity,
            employeeId,
            companyId,
            description,
        }).save();
        logger('success', 'SUCCESS CREATE PRODUCT INVENTORY - ', res._id);
        return res;
    } catch (e) {
        logger('error', e.message);
        return Exception.CANNOT_ADD_PRODUCT_INVENTORY;
    }
}

export { addProductInventory };