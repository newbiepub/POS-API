import {Product} from "../models/product";
import * as _ from "lodash";
import {Inventory} from "../models/inventory";

class ProductController {
    static async getProduct (id) {
        try {
            let products = await Product.find({"employeeId": id}).exec(),
                inventory = await Inventory.findOne({"employeeId": id}).exec();
            products = products.map(doc => doc.toJSON()); // Convert to array
            for(let product of products) {
                let inventoryProduct =  _.find(inventory.productItems, item => item.productId === product._id.toString()) || {};
                product.quantity = inventoryProduct.quantity || 0;
            }
            return products;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    static async createProduct (product) {
        try {
            return await new Product(product).save();
        } catch(e) {
            throw e;
        }
    }

    static async upsertProduct (product) {
        try {
            return await Product.findOneAndUpdate({_id: product._id}, {$set: _.omit(product, ["_id"])}, {multi: true, upsert: true});
        } catch(e) {
            throw e;
        }
    }
}

export {ProductController};