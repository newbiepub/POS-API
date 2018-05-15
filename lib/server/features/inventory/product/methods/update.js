import {InventoryActivityLogger, Product, ProductInventory} from "../../../../models/modelConfigs";
import {logger} from "../../../../../utils/helpers";

export const updateProduct = async (productId, name, quantity, importPrice,
                                    description, unit,productCode, companyId, employeeId) => {
    try {
        // Stringify and parse for removing undefined properties
        // Update Product
        let updateDataProduct = JSON.stringify({
            name,
            description,
            unit,
            productCode
        });
        // Update Product Inventory
        let updateDataProductInventory = JSON.stringify({
            importPrice, quantity,
        })

        updateDataProduct = JSON.parse(updateDataProduct);
        updateDataProductInventory = JSON.parse(updateDataProductInventory);
        logger('info', 'Update product ..\n', updateDataProduct);
        logger('info', 'Update product inventory ...\n', updateDataProductInventory);
        // Update
        let [ product, productInventory ] = await Promise.all([
            Product.findOneAndUpdate({_id: productId}, {$set: updateDataProduct}).exec(),
            ProductInventory.findOneAndUpdate({product: productId}, {$set: updateDataProductInventory}).exec()
        ])
        // Logger
        await new InventoryActivityLogger({
            message: `UPDATE_PRODUCT_${product.name}`,
            data: JSON.stringify({product, productInventory}),
            type: 'logger_activity_update_product',
            companyId,
            employeeId,
        }).save();
    } catch (e) {
        throw e;
    }
}