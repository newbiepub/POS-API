import {InventoryActivity, Product, ProductInventory, InventoryHistory} from "../../models/modelConfigs";
import {createInventoryHistory} from "../../resolvers/inventoryActivity";
import {logger} from "../../../utils/helpers";

/**
 * Mutations
 */

// Profile default data
let initialProfileData = {
    name: "",
    phone: "",
    address: "",
    email: "",
    description: ""
};

/**
 * Add product to pos's inventory
 * @param productId
 * @param quantity
 * @param employeeId
 * @param companyId
 * @param salePrice
 * @returns {Promise.<*>}
 */

async function addProductToPOS (productId, quantity, employeeId, companyId, salePrice) {
    let product = null, currency = null, productInventory = null;

    try {
        // Product
        product = await Product.findOneAndUpdate({_id: productId}, {$pull: {
            price: {name: 'default'}
        }}).exec();
        // product inventory
        productInventory = await ProductInventory.findOne({product: productId, companyId}).exec();
        // currency
        currency = (product.price[0] || {}).currency;
        // Quantity
        quantity = productInventory.quantity > quantity ? quantity : productInventory.quantity;
        // Update price
        await Product.findOneAndUpdate({ _id: productId }, { $push: {
            price: {
                name: 'default',
                price: salePrice,
                currency
            }
        }}).exec();
        // Update quantity
        await ProductInventory.update(
            { product: productId, employeeId },
            { $inc: { quantity: +quantity }},
            { upsert: true }).exec();
        return await ProductInventory.findOneAndUpdate(
            { product: productId, companyId },
            { $inc: { quantity: -quantity }}).exec();
    } catch (e) {
        logger('error', e.message);
        // rollback product
        if(product) {
            await Product.findOneAndUpdate({_id: productId}, {$set: {...product}}).exec();
        }
        // rollback product inventory
        if(productInventory) {
            productInventory = productInventory.toJSON();
            await ProductInventory.update({product: productId}, {$set: {...productInventory}}).exec();
        }

        return {
            productId,
            companyId,
            employeeId,
            quantity,
            salePrice
        };
    }
}

/**
 * Inventory Order
 * @param userId
 * @param employeeId
 * @param products
 * @param totalPrice
 * @param totalQuantity
 * @returns {Promise.<void>}
 */
async function createInventoryOrder(userId = '',
                                    employeeId = '',
                                    products = [],
                                    totalPrice = 0,
                                    totalQuantity = 0,
                                    fromPOS = false) {
    try {
        let status = fromPOS ? 'pending' : 'processing';
        let dateDelivered = fromPOS ? null : new Date();

        return await new InventoryActivity({
            products,
            totalQuantity,
            totalPrice,
            type: 'posImport',
            from: {
                _id: userId
            },
            to: {
                _id: employeeId
            },
            status: 'processing',
            dateRequest: new Date(),
            dateDelivered: dateDelivered,
            dateReceived: null
        }).save();
    } catch (e) {
        console.error(e.message);
        throw new Error("INTERNAL_SERVER_ERROR");
    }
}

export async function exportProductToPOS (userId = '', employeeId = '', products = [], confirmOption = false) {
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
        if(confirmOption) {
            result = await createInventoryOrder(userId, employeeId, products, totalPrice, totalQuantity, false);
        } else {
            // Add product to pos inventory
            for(let product of products) {
                promises.push(addProductToPOS(product._id, product.quantity, employeeId, userId, product.salePrice));
            }
            result = await Promise.all(promises);
            logger('success', 'RESULT LENGTH = ', result.length);
            // create company history
            await createInventoryHistory({_id: userId}, {_id: employeeId}, 'export', products, null, totalQuantity, totalPrice);
            // create pos inventory history
            await createInventoryHistory({_id: userId}, {_id: employeeId}, 'import', products, null, totalQuantity, totalPrice);
        }
    } catch (e) {
        throw e;
    }
}

/**
 * Get query
 */

export async function getInventoryHistory(userId, type) {
    try {
        let query = {type: type}, inventoryHistory = null;

        if(type === "import") {
            query = {'to._id': userId, ...query}
        } else if(type === "export") {
            query = {'from._id': userId, ...query};
        }

        inventoryHistory = await InventoryHistory.find(query).exec();
        logger('success', 'INVENTORY HISTORY - ', inventoryHistory.length);
        return inventoryHistory;
    } catch (e) {
        throw e;
    }
}