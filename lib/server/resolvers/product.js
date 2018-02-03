import {Category, Currency, Product, ProductInventory} from "../models/modelConfigs";
import {currentUserProductInventory} from "./inventory";

const defaultPrice = {
    name: "",
    price: 0,
    currency: null
};

export async function addNewProduct (name, price = [defaultPrice], unit, description, categoryId, companyId, productCode, quantity = 0) {
    let product = null;
    try {
        let insertItem = {
            name,
            price,
            unit,
            description,
            categoryId,
            companyId,
            productCode
        };

        product = await new Product(insertItem).save();

        // Add Product To Inventory
       return await ProductInventory.findOneAndUpdate({product: product._id}, {$set: {quantity}}, {upsert: true, new: true})
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
           }).exec();
    }
    catch(e) {

        // Roll back when fail to create Inventory Product
        if(!!product) {
            await Product.remove({_id: product._id}).exec();
        }

        throw e;
    }
}

export async function updateProduct(productId, name, price, unit, description, categoryId, companyId, productCode, quantity) {
    try {
        let updateItem = {$set: {
            name,
            price,
            unit,
            description,
            categoryId,
            companyId,
            productCode
        }};


        await Product.findOneAndUpdate({_id: productId}, updateItem).exec();
        return await ProductInventory.findOneAndUpdate({product: productId}, {$set: {quantity}}, {new: true})
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
            }).exec();

    } catch(e) {
        throw e;
    }
}