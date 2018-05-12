import {Category} from "../../../../models/modelConfigs";

export const fetchAllCategory = async (companyId) => {
    try {
        return await Category.find({ companyId }).exec();
    } catch (e) {
        throw e;
    }
}