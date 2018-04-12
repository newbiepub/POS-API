import {Currency, IngredientInventory, Inventory, ProductInventory} from "../models/modelConfigs";
import {addNewProduct} from "./product";
import {createInventoryHistory} from "./inventoryActivity";

export const currentUserProductInventory = async (query, options = {}) => {
    try {
        return await ProductInventory.find(query)
            .populate({
                path: "product",
                model: "product",
                populate: [
                    {
                        path: "price.currency"
                    },
                    {
                        path: "categoryId",
                        model: "category"
                    }
                ]
            }).limit(options.limit).skip(options.skip).exec();
    }
    catch (e) {
        console.log(e);
        console.warn("error - currentUserInventory")
    }
};


/**
 * Import product from producer for web pos manager
 * @param from
 * @param to
 * @param products
 * @param type
 * @param userId
 * @returns {Promise<Array>}
 */
export const productActivity = async (from, to, products, type, userId) => {
    let promises = [], productData = [], productHistory = [], totalQuantity = 0, totalPrice = 0;

    try {
        products.forEach((product) => {
            promises.push(addNewProduct(
                product.name,
                product.price,
                product.unit,
                product.description,
                product.category,
                userId,
                product.productCode,
                product.quantity
            ))
        });
        // Total quantity
        totalQuantity = products.reduce((total, product) => {
            total += +product.quantity;
            return total;
        }, 0);

        totalPrice = products.reduce((total, product) => {
            total = total + (+product.price.find(price => price.name === "import").price) * (+product.quantity);
            return total;
        }, 0);

        productData = await Promise.all(promises);
        // Create Inventory History
        productHistory = await createInventoryHistory(from, to, type, productData, null, totalQuantity, totalPrice);
        return productHistory;
    } catch (e) {
        console.log(e.message);
        throw e;
    }
};

export const getAmountInventory = async (query) => {
    try {
        let result = await ProductInventory.find(query).count().exec();
        return {inventoryAmount: result}
    }
    catch (e) {
        console.log(e);
    }
};

export const currentUserIngredientInventory = async (query, options = {}) => {
    try {
        return await IngredientInventory.find(query)
            .populate({
                path: "ingredient",
                model: "ingredient"
            }).limit(options.limit).skip(options.skip).exec();
    }
    catch (e) {
        console.log(e);
    }
};

export const subtractProductAfterTransactionEmployee = async (productItems, employeeId) => {

    try {
        for (let items of productItems) {
            if (items.hasOwnProperty("productId")) {
                await  ProductInventory.update({
                    employeeId: employeeId,
                    product: items.productId
                }, {$inc: {quantity: -(+items.quantity)}}).exec();
                // console.log("INVENTORY QUANTITY - ", inventoryQuantity);
            }
        }
        return true
    } catch (e) {
        console.log("subtractProductAfterTransactionEmployee-"+e);
        return false
    }

};
export const returnProductInventoryIssueRefund = async (productItems, employeeId) => {

    try {
        for (let items of productItems) {
            if (items.hasOwnProperty("productId")) {
                await  ProductInventory.update({
                    employeeId: employeeId,
                    product: items.productId
                }, {$inc: {quantity: items.quantity}}).exec();

            }

        }
        return true
    } catch (e) {
        console.log(e);
        return false
    }

};