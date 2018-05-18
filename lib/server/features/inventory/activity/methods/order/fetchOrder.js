import {InventoryActivity, ProductInventory, User} from "../../../../../models/modelConfigs";
import {logger} from "../../../../../../utils/helpers";

export const fetchInventoryOrder = async (companyId) => {
    try {
        let orders;

        orders = await InventoryActivity.find({
            'from._id': companyId,
            status: 'pending'
        }).exec();

        orders = await orders.reduce( async (result, order) => {
            result = await result;
            try {
                let promises, to;

                // Query employee info
                to = await User.findOne({_id: order.to._id}).exec();
                to = !!to ? to.toJSON() : order.to; // Deserializer
                // Get List Products
                promises = order.products.map((product) => new Promise(async (resolve, _) => {
                    try {
                        let productInventory = await ProductInventory
                            .findOne({product: product._id})
                            .populate([
                                {path: 'product'}
                            ])
                            .exec()
                        productInventory = productInventory.toJSON();

                        resolve({
                            ...productInventory,
                            name: (productInventory.product || {}).name || '',
                            quantity: product.quantity
                        });
                    } catch (e) {
                        logger('error', 'error - ', e.message);
                    }
                }))
                // Employee infomations
                order.to   = !!to ? {_id: order.to._id,
                    name: to.profile.name,
                    address: to.profile.address,
                    phone: to.profile.phoneNumber
                } : order.to;
                // List Products
                order.products = await Promise.all(promises);
                logger('success', 'order = ', order);
                result = [...result, order];
            } catch (e) {
                logger('error', 'error - ', e.message);
            }
            return result;
        }, [])
        return orders;
    } catch (e) {
        throw e;
    }
}