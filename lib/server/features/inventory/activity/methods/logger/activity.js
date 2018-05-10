import {InventoryActivityLogger} from "../../../../../models/modelConfigs";

export const createActivityLog = async (message, companyId, employeeId, type) => {
    try {
        return await new InventoryActivityLogger({
            message,
            data: null,
            type: 'logger_activity_company',
            companyId,
            employeeId,
            type
        }).save()
    } catch (e) {
        throw e;
    }
}