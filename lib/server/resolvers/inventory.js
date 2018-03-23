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
                        path: "price.currency",
                        model: "currency"
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

export const productActivity = async (from, to, products, type, userId) => {
    let promises = [], productData = [], productHistory = [], totalQuantity;

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
        totalQuantity = products.reduce((total, product) => {
            total += +product.quantity;
            return total;
        }, 0);
        productData = await Promise.all(promises);
        // Create Inventory History
        productHistory = await createInventoryHistory(from, to, type, productData, null, totalQuantity);
        return productHistory;
    } catch (e) {
        throw e;
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
            // console.warn(items);
            if (items.hasOwnProperty("_id")) {
                let inventoryQuantity = await ProductInventory.find({
                    employeeId: employeeId,
                    product: items._id
                }, {quantity: 1});
                await  ProductInventory.update({
                    employeeId: employeeId,
                    product: items._id
                }, {$set: {quantity: inventoryQuantity[0].quantity - items.quantity}}).exec();
            }

        }
        return true
    } catch (e) {
        console.log(e);
        return false
    }

};
export const returnProductInventoryIssueRefund = async (productItems, employeeId) => {

    try {
        for (let items of productItems) {
            if (items.hasOwnProperty("_id")) {
                let inventoryQuantity = await ProductInventory.find({
                    employeeId: employeeId,
                    product: items._id
                }, {quantity: 1});
                await  ProductInventory.update({
                    employeeId: employeeId,
                    product: items._id
                }, {$set: {quantity: inventoryQuantity[0].quantity + items.quantity}}).exec();
            }

        }
        return true
    } catch (e) {
        console.log(e);
        return false
    }

};