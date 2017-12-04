import {Product} from "../models/product";

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
            return await Product.findOneAndUpdate({_id: product._id}, {$set: product}, {multi: true, upsert: true});
        } catch(e) {
            throw e;
        }
    }
}

export {ProductController};