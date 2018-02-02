import {Currency, IngredientInventory, Inventory, ProductInventory} from "../models/modelConfigs";

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
    catch(e) {
        console.log(e);
        console.warn("error - currentUserInventory")
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
    catch(e) {
        console.log(e);
    }
};