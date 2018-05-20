import {logger} from "../../../../../utils/helpers";
import {ProductInventory} from "../../../../models/modelConfigs";
import {normalize_inventory_history_products} from "../../../../../utils/normalizeData/history";

const addProductToPOS = async (productId, exportQuantity, employeeId, companyId, priceSale) => {
    let product = null, currency = null, productInventory = null, oldPrices, salesPrice,
        productEmployee, productCompany, quantity;
    let populate = {
        path: "product",
        model: "product",
        populate: [
            {
                path: "categoryId",
                model: "category"
            }
        ]
    }

    try {
        // product inventory
        productInventory = await ProductInventory.findOne({product: productId, companyId}).exec();
        productInventory = productInventory.toJSON(); // Deserialize
        // Quantity
        quantity = productInventory.quantity > exportQuantity ? exportQuantity : productInventory.quantity;
        // Update price
        salesPrice       = productInventory.prices.find(price => price.name === 'default') || {};
        salesPrice.price = priceSale;
        // Update Employee Inventory
        productEmployee = await ProductInventory.findOneAndUpdate(
            { product: productId, employeeId },
            {
                $inc: { quantity: +quantity },
                $set: { prices: productInventory.prices, importPrice: priceSale }
            },
            { upsert: true, new: true }).populate([populate]).exec();
        // Update Company Inventory
        productCompany  = await ProductInventory.findOneAndUpdate(
            { product: productId, companyId },
            { $inc: { quantity: -quantity }},
            { new: true }).populate([populate]).exec();
        // Normalization
        return normalize_inventory_history_products(productEmployee);
    } catch (e) {
        logger('error', e.message);
        // Rollback
        if(productEmployee) {
            ProductInventory.remove({_id: productEmployee._id}).exec();
        }

        if(productCompany) {
            ProductInventory.update(
                { _id: productCompany._id },
                { $set: {quantity: +quantity} })
        }
    }
}

export { addProductToPOS }