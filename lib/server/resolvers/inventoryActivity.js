import {Ingredient, InventoryHistory, Product, ProductInventory} from "../models/modelConfigs";

// Profile default data
let initialProfileData = {
    name: "",
    phone: "",
    address: "",
    email: "",
    description: ""
};

/**
 * Create Inventory History for each inventory activity
 * @param from
 * @param to
 * @param type
 * @param products
 * @param ingredients
 * @param totalQuantity
 * @returns {Promise.<*>}
 */
async function createInventoryHistory(from = null, to = null, type, products = null, ingredients = null, totalQuantity) {
    let inventoryHistory = null;
    let currentDate = new Date();
    let totalPrice = products.reduce((total, product) => {
       let price = product.price.find(item => item.name === 'default');
       total += price.price;
       return total;
    }, 0);

    try {
        inventoryHistory = await new InventoryHistory({
            products,
            ingredients,
            from,
            to,
            type,
            totalQuantity,
            totalPrice,
            dateDelivered: currentDate,
            dateReceived: currentDate
        }).save();
    } catch (e) {
        console.log("ERROR - ", e.message);
    }
    return inventoryHistory;
}

async function updateProductQuantity(product, from, to) {
    let updatedProduct = null;
    let productInventory = null;
    let options = {
        new: true,
        upsert: true,
        runValidators: true
    }; // Update Options

    try {
        // Update product information
        updatedProduct = await Product.findOneAndUpdate({}, {}, {new: true, upsert: true, runValidators: true}).exec();
        // Update from product inventory quantity
        productInventory = await ProductInventory.findOneAndUpdate({}, {}, options).exec();
        // Update to product inventory quantity
        productInventory = await ProductInventory.findOneAndUpdate({}, {}, options).exec();
    } catch (e) {
        // Rollback product
        if (!!updatedProduct) {
            await Product.remove({_id: updatedProduct._id.toString()}).exec();
        }
        // Rollback product inventory
        if (!!productInventory) {
            await ProductInventory.remove({_id: productInventory._id.toString()})
        }
        throw e;
    }
}

async function updateIngredientQuantity(ingredient, from, to) {
    let updatedIngredient = null;
    let ingredientInventory = null;
    let options = {
        new: true,
        upsert: true,
        runValidators: true
    }; // Update options

    try {
        // Update ingredient information
        updatedIngredient = await Ingredient.findOneAndUpdate({} ,{} , options).exec();
    } catch (e) {
        throw e;
    }
}

async function inventoryActivity(from = initialProfileData, to = initialProfileData, productData = []) {
    try {
        each(productData, (data) => {

        })
    } catch (e) {
        console.log("ERROR - ", e.message);
        console.log("STACK - ", e.stack);
    }
}

module.exports = {inventoryActivity, createInventoryHistory};