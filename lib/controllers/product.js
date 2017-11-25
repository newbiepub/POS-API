import {Product} from "../models/product";

class ProductController {
    static async getProduct (limit, skip) {
        return await Product.find({}).limit(limit).skip(skip).exec();
    }
}

export {ProductController};