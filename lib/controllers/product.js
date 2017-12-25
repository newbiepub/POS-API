import {Product} from "../models/product";
import * as _ from "lodash";
import {Inventory} from "../models/inventory";

class ProductController {
    static async getProduct (id) {
        try {
            let products = await Product.find({"companyId": id}).exec();
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