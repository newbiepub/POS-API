import {InventoryActivityLogger} from "../../../../../models/modelConfigs";
import {logger} from "../../../../../../utils/helpers";

export const fetchLog = async (companyId, limit = 10, skip = 0) => {
    try {
        return await InventoryActivityLogger.find({
            companyId,
            type: {$in: [
                'logger_error_export_product_to_POS',
                'logger_activity_update_product',
                'logger_activity_company',
            ]}
        }).limit(limit).skip(skip).exec();
    } catch (e) {
        throw e;
    }
}