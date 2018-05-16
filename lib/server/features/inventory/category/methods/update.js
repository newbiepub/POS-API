import {logger} from "../../../../../utils/helpers";
import {Category, Product} from "../../../../models/modelConfigs";

export const updateCategory = async (categoryId, name, products) => {
    try {
        let promises = [];
        logger('info', 'product - ', products);
        // Update products' category
        promises = products.map(productId => new Promise(async (resolve, reject) => {
            try {
                await Product.update({_id: productId}, {categoryId: categoryId}).exec();
            } catch (e) {
                logger('error', 'error - ', e.message, ' - stack -', e.stack)
            }
            resolve();
        }));

        // Update category
        promises.push(new Promise(async (resolve, reject) => {
            try {
                await Category.update({_id: categoryId}, {$set: {name}}).exec();
                logger('success', 'Updated category - ', categoryId);
            } catch (e) {
                logger('error', 'error - ', e.message, ' - stack - ', e.stack)
            }
            resolve();
        }))
        await Promise.all(promises);
    } catch (e) {
        throw e;
    }
}