import {CATEGORY} from "./index";

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
            return await CATEGORY.CREATE_CATEGORY(context.user._id, variables.name, variables.description);
        } catch (e) {
            throw e;
        }
    },

}