import {Ingredient, IngredientInventory} from "../models/modelConfigs";

export async function addNewIngredient(name, description, price = 0, unit = "", companyId, quantity) {
    let ingredient = null;
    try {
        ingredient = await new Ingredient({
            name, description, price, unit, companyId
        }).save();

        return await IngredientInventory
            .findOneAndUpdate({ingredient: ingredient._id}, {$set: {quantity}}, {new: true})
            .populate({
                path: "ingredient",
                model: "ingredient"
            })
            .exec();


    } catch(e) {

        // Roll back ingredient when cannot update IngredientInventory
        if(!!ingredient) {
            return await Ingredient.remove({_id: ingredient._id}).exec();
        }

        throw e;
    }
}

export async function updateIngredient (ingredientId, name, description, price, companyId, quantity) {
    try {
        let updateItems = {$set: {
            name,
            description,
            price, companyId
        }};

        // Update Ingredient And Ingredient Inventory
        let [, ingredient] = await Promise.all([
            Ingredient.update({_id: ingredientId}, updateItems).exec(),
            IngredientInventory.findOneAndUpdate({ingredient: ingredientId}, {$set: {quantity}}, {new: true})
                .populate({
                    path: "ingredient",
                    model: "ingredient"
                })
                .exec()
        ]);

        return ingredient;
    }
    catch(e) {
        throw e;
    }
}