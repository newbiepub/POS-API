import {getInventoryHistory} from "./activity";
import INVENTORY_ACTIVITY from "./activity/index";

export const InventoryMutation = {
    async requestPOSToCompany (obj, variables, context) {
        try {
            await INVENTORY_ACTIVITY.EXPORT_PRODUCT_TO_POS(
                context.user._id,
                variables.employeeId,
                variables.products,
                variables.confirmOption
            );
            return { success: true }
        } catch (e) {
            throw e;
        }
    },
};

export const InventoryQuery = {
    async getUserInventoryHistory (obj, variables, context) {
        try {
           return await getInventoryHistory(context.user._id, variables.type)
        } catch (e) {
            throw e;
        }
    }
}