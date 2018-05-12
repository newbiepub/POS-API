import {Category} from "../../../../models/modelConfigs";
import {logger} from "../../../../../utils/helpers";

export const createCategory = async (companyId, name, description) => {
    try {
        let category = await new Category({
            name,
            description,
            companyId
        }).save();
        logger('success', 'created category - ', category._id);
        return category;
    } catch (e) {
        throw e;
    }
}