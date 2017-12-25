import {Category} from "../models/category";

export default class category{
    static async getCategoryById(id)
    {
       return await Category.find({"_id": id}).exec()
    }
    static async getCategory(id)
    {
        return await Category.find({"companyId": id}).exec()
    }
}

