import {Currency, Inventory} from "../models/modelConfigs";

export const currentUserInventory = async (query) => {
    try {
        let data = await Inventory.findOne(query)
            .populate({
                path: 'productItem.productId',
                model: "product",
                populate: {
                    path: "price.currency",
                    model: "currency"
                }
            }).exec();
        return data;
    }
    catch(e) {
        console.log(e);
        console.warn("error - currentUserInventory")
    }
};