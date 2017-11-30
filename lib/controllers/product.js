import {Product} from "../models/product";

class ProductController {
    static async getProduct (id) {
        return await Product.find({"employeeId": id}).exec();
    }

}

export {ProductController};