import INVENTORY_ACTIVITY from "./index";
import {logger} from "../../../../utils/helpers";

const INVENTORY_ACTIVITY_QUERY = {
    FETCH_LOGS: async (_, variables, contenxt) => {
        try {
            if(!contenxt.user.roles.includes('company')) throw new Error('ONLY_COMPANY')
            return await INVENTORY_ACTIVITY.FETCH_LOGS(contenxt.user._id);
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
    APPROVE_INVENTORY_ORDER: async (obj, variables, context) => {
        try {
            if(context.user.roles.includes('company')) {
                await INVENTORY_ACTIVITY.APPROVE_INVENTORY_ORDER(variables.activityId, context.user._id, variables.employeeId);
                return { success: true };
            }
            throw new Error('ONLY_COMPANY');
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
                await INVENTORY_ACTIVITY.REVERT_INVENTORY_ORDER(variables.activityId, context.user._id, context.user.password, variables.password)
                return { success: true }
            }
            throw new Error('ONLY_COMPANY');
        } catch (e) {
            throw e;
        }
    }
}

export { INVENTORY_ACTIVITY_QUERY, INVENTORY_ACTIVITY_MUTATION };