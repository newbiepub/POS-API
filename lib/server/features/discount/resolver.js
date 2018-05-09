import DISCOUNT from "./index";
import {discount_input_data} from "../../../utils/normalizeData/discount";

export const DISCOUNT_QUERY = {
    FETCH_ALL_DISCOUNT: async (obj, variables, context) => {
        try {
            return await DISCOUNT.FETCH_DISCOUNT();
        } catch (e) {
            throw e;
        }
    }
}

export const DISCOUNT_MUTATION = {
    CREATE_DISCOUNT: async (obj, variables, context) => {
        try {
            if(context.user.roles.includes('company')) {
                let {
                    products,
                    employeeIds,
                    name,
                    description,
                    value,
                    type,
                    appliedDate,
                    dueDate,
                } = discount_input_data(variables);

                return await DISCOUNT.CREATE_DISCOUNT(products, name, description, employeeIds, context.user._id,
                    appliedDate, dueDate, type, value)
            }
            throw new Error('ONLY_COMPANY_CREATE_DISCOUNT');
        } catch (e) {
            throw e;
        }
    }
}