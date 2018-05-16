import {Category, Product} from "../../../../models/modelConfigs";
import {logger} from "../../../../../utils/helpers";

export const createCategory = async (companyId, name, description, products = []) => {
    try {
        let category = await new Category({
            name,
            description,
            companyId
        }).save();
        logger('success', 'created category - ', category._id);
        let promises = products.map(item => new Promise(async (resolve, reject) => {
            try {
                await Product.update({_id: item}, {$set: {categoryId: category._id}}).exec();
            } catch (e) {
                logger('error', 'error - ', e.message, ' - stack - ', e.stack);
            }
            resolve();
        }));
        await Promise.all(promises);
        return category;
    } catch (e) {
        throw e;
    }
}