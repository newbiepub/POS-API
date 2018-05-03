import {logger} from "../../../../../utils/helpers";
import {Category, Product} from "../../../../models/modelConfigs";
import Exception from "../../../../constants/errorStatus";

const addProduct = async (name = '', unit = 'cái', description = '', categoryName = '', companyId = '', productCode = '') => {
    try {
        // Upsert category
        let categoryId = null;
        let category = await Category.findOneAndUpdate({
            name: {$regex: categoryName.toLowerCase(), $options: 'gi'}
            }, {$set: {name: categoryName}}, {upsert: true, new: true}).exec();

        if(category) {
            categoryId = category._id.toString();
            logger('success', 'CREATE CATEGORY - ', categoryId)
        }
        // Create new product
        logger('info', 'CREATING PRODUCT...');
        let res = await new Product({
            name, description, unit,
            categoryId, companyId, productCode
        }).save();
        logger('success', 'DONE CREATE PRODUCT - ', res._id);
        return res;
    } catch (e) {
        logger('error', e.message);
        return Exception.CANNOT_ADD_PRODUCT;
    }
}

export { addProduct };