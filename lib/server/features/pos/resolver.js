import POS_MANAGEMENT from "./index";

export const POS_MANAGEMENT_MUTATION = {
    DEACTIVATE_POS: async (_, variables, context) => {
        try {
            if(!context.user.roles.includes('company')) throw new Error('COMPANY_ONLY');
            return POS_MANAGEMENT.DEACTIVATE(variables.employeeId);
        } catch (e) {
            throw e;
        }
    },
    UPDATE_POS: async (_, variables, context) => {
        try {
            if(!context.user.roles.includes('company')) throw new Error('COMPANY_ONLY');

            let {employeeId, username, password, name, address, phoneNumber} = variables;
            return POS_MANAGEMENT.UPDATE_USER(employeeId, username, password, name, address, phoneNumber)
        } catch (e) {
            throw e;
        }
    }
};