import {Product, ProductInventory} from "../../../../models/modelConfigs";
import {logger} from "../../../../../utils/helpers";

export const updateProduct = async (productId, name, quantity, prices,
                                    description, unit,productCode) => {
    try {
        // Fetch product
        let [product, productInventory] = await Promise.all([
            Product.findOne({_id: productId}).exec(),
            ProductInventory.findOne({product: productId}).exec()
        ]);
        logger('info', 'update product - \n', product);
        logger('info', 'update product inventory - \n', productInventory);
    } catch (e) {
        throw e;
    }
}