import {CATEGORY} from "./index";
import {logger} from "../../../../utils/helpers";

export const CATEGORY_QUERY = {
    FETCH_CATEGORY: async (obj, variables, context) => {
        try {
            return await CATEGORY.FETCH_CATEGORY(context.user._id);
        } catch (e) {
            throw e;
        }
    }
}

export const CATEGORY_MUTATION = {
    CREATE_CATEGORY: async (obj, variables, context) => {
        try {
            if(context.user.roles.includes('company')) {
                return await CATEGORY.CREATE_CATEGORY(context.user._id, variables.name, variables.description, variables.products);
            }
            throw new Error('ONLY_COMPANY');
        } catch (e) {
            throw e;
        }
    },
    UPDATE_CATEGORY: async (obj, variables, context) => {
        try {
            if(context.user.roles.includes('company')) {
                await CATEGORY.UPDATE_CATEGORY(variables.categoryId, variables.name, variables.products);
                return {success: true}
            }
            throw new Error('ONLY_COMPANY');
        }
        catch(e) {
            throw e;
        }
    }
}