import {InventoryHistory, Product, ProductInventory} from "../../models/modelConfigs";
import {createInventoryHistory} from "../../resolvers/inventoryActivity";

/**
 * Mutations
 */

async function addProductToPOS (productId, quantity, employeeId, companyId,priceSale) {
    let product = null, currency = null, oldPrice = null;

    try {
        product = await Product.findOneAndUpdate({_id: productId}, {$pull: {
            price: {name: "default"}
        }}).exec();
        oldPrice = product.price;
        currency = ( product.price.find(price => price.name === "default") || {} ).currency;
        product = await Product.findOneAndUpdate({_id: productId}, {$push: {
            price: {
                name: "default",
                price: priceSale,
                currency
            }
        }}).exec();
        await ProductInventory.findOneAndUpdate({product: productId, employeeId}, {$set: {
            product: productId,
            quantity,
            employeeId
        }}, { new: true, upsert: true }).exec();

        return await ProductInventory.findOneAndUpdate({product: productId, companyId}, {
            $inc: {quantity: -quantity}
        }).populate([
            {
                path: "product",
                model: "product",
                populate: [
                    {
                        path: "price.currency",
                        model: "currency"
                    }
                ]
            }
        ]).exec();
    } catch (e) {
        if(product) {
            await Product.findOneAndUpdate({_id: productId}, {$set: {price: oldPrice}}).exec();
        }
        throw e;
    }
}

export async function exportProductToPOS (userId) {
    let promises = [], productData = [], totalQuantity = 0, totalPrice = 0;

    try {
        let productInventory = await ProductInventory.find({companyId: userId}).populate([{
            path: "product",
            model: "product",
            populate: [
                {
                    path: "price.currency",
                    model: "currency"
                }
            ]
        }]).exec();

        for(let data of productInventory) {
            let product = data.product;
            let priceSales = (product.price.find(price => price.name === "import") || {}).price || 0;
            totalPrice += priceSales * +data.quantity;
            totalQuantity += data.quantity;
            promises.push(addProductToPOS(product._id, data.quantity, '5abfa3504435d7001eec6f66', userId, priceSales));
        }
        productData = await Promise.all(promises);
        productData = productData.map(item => {
            item = item.toJSON();
            item.product.quantity = item.quantity;
            return item.product;
        });

        await createInventoryHistory({_id: userId}, {_id: '5abfa3504435d7001eec6f66'}, 'export', productData, null, totalQuantity, totalPrice);
        await createInventoryHistory({_id: userId}, {_id: '5abfa3504435d7001eec6f66'}, 'import', productData, null, totalQuantity, totalPrice);
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
        // Normalize for graphql data
        inventoryHistory = inventoryHistory.map(item => {
           item.products = item.products.map(product => {
               product._id = `${product._id}_${item.type}_${item._id}`;
               return product
           });
            return item;
        });
        return inventoryHistory;
    } catch (e) {
        throw e;
    }
}