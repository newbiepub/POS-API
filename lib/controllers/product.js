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
}

export {ProductController};