import {Product} from "../models/product";
import * as _ from "lodash";

class ProductController {
    static async getProduct (id) {
        return await Product.find({"employeeId": id}).exec();
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