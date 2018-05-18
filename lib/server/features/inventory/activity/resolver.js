import INVENTORY_ACTIVITY from "./index";
import {logger} from "../../../../utils/helpers";

const INVENTORY_ACTIVITY_QUERY = {
    FETCH_LOGS: async (_, variables, context) => {
        try {
            if(!context.user.roles.includes('company')) throw new Error('ONLY_COMPANY')
            return await INVENTORY_ACTIVITY.FETCH_LOGS(context.user._id);
        } catch (e) {
             throw e;
        }
    },
    FETCH_INVENTORY_ACTIVITY_COMPANY: async (_, variables, context) => {
        try {
            if(!context.user.roles.includes('company')) throw new Error('ONLY_COMPANY')
            return await INVENTORY_ACTIVITY.FETCH_INVENTORY_ACTIVITY_COMPANY(context.user._id);
        } catch (e) {
            throw e;
        }
    },

    FETCH_INVENTORY_ACTIVITY_EMPLOYEE: async (_, variables, contenxt) => {
        try {
            // console.log(variables.limit,variables.skip);
            if(contenxt.user.roles.includes('employee')){
                return await INVENTORY_ACTIVITY.FETCH_INVENTORY_ACTIVITY_EMPLOYEE(contenxt.user._id,variables.limit,variables.skip);
            }

        } catch (e) {
            throw e;
        }
    },
    FETCH_INVENTORY_ACTIVITY_EMPLOYEE_AMOUNT: async (_, variables, contenxt) => {
        try {
            if(contenxt.user.roles.includes('employee')){
                return await INVENTORY_ACTIVITY.FETCH_INVENTORY_ACTIVITY_EMPLOYEE_AMOUNT(contenxt.user._id);
            }

        } catch (e) {
            throw e;
        }
    }
}

const INVENTORY_ACTIVITY_MUTATION = {
    CREATE_INVENTORY_ORDER: async (obj, variables, context) => {
        try {
            if(context.user.roles.includes('company')) {
                await INVENTORY_ACTIVITY.CREATE_INVENTORY_ORDER(context.user._id, variables.employeeId, variables.products)
                return { success: true };
            }
            throw new Error('ONLY_COMPANY')
        } catch (e) {
            throw e;
        }
    },
    CONFIRM_INVENTORY_ORDER: async (obj, variables, context) => {
        try {
            if(context.user.roles.includes('employee')) {
                await INVENTORY_ACTIVITY.CONFIRM_INVENTORY_ORDER(variables.activityId, context.user._id);
                return { success: true };
            }
            throw new Error('ONLY_EMPLOYEE');
        } catch (e) {
            throw e;
        }
    },
    REQUEST_INVENTORY_ORDER: async (obj, variables, context) => {
        try {
            if(context.user.roles.includes('employee')) {
                await INVENTORY_ACTIVITY.REQUEST_INVENTORY_ORDER(context.user._id, variables.products);
                return { success: true };
            }
            throw new Error('ONLY_EMPLOYEE');
        } catch (e) {
            throw e;
        }
    },
    REVERT_INVENTORY_ORDER: async (obj, variables, context) => {
        try {
            if(context.user.roles.includes('company')) {
                await INVENTORY_ACTIVITY.REVERT_INVENTORY_ORDER(variables.activityId, context.user._id, context.user.password, variables.password);
                return { success: true }
            }
            throw new Error('ONLY_COMPANY');
        } catch (e) {
            throw e;
        }
    }
}

export { INVENTORY_ACTIVITY_QUERY, INVENTORY_ACTIVITY_MUTATION };