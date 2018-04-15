import {exportProductToPOS, getInventoryHistory} from "./activity";

export const InventoryMutation = {
    async requestPOSToCompany (obj, variables, context) {
        try {
            await exportProductToPOS(
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