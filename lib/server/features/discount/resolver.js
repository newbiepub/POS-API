import DISCOUNT from "./index";
import {discount_input_data} from "../../../utils/normalizeData/discount";
import {logger} from "../../../utils/helpers";

export const DISCOUNT_QUERY = {
    FETCH_ALL_DISCOUNT: async (obj, variables, context) => {
        try {
            return await DISCOUNT.FETCH_DISCOUNT();
        } catch (e) {
            throw e;
        }
    },
    GET_DISCOUNT_EMPLOYEE: async (obj, variables, context) => {
        try {
            let employeeId = context.user._id;
            let discount = await DISCOUNT.FETCH_DISCOUNT_EMPLOYEE(employeeId);
            return discount
        } catch (e) {
            throw e;
        }
    },
};

export const DISCOUNT_MUTATION = {
    CREATE_DISCOUNT: async (obj, variables, context) => {
        try {
            if (context.user.roles.includes('company')) {
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
    },
    UPDATE_DISCOUNT:  async (obj, variables, context) => {
        try {
            if (context.user.roles.includes('company')) {
                logger('info', 'update item - ', variables);
                let {
                    discountId,
                    ...updateItems
                } = variables;

                return await DISCOUNT.UPDATE_DISCOUNT(variables.discountId, updateItems);
            }
            throw new Error('ONLY_COMPANY');
        } catch (e) {
            logger('error', 'error - ', e.stack);
            throw e;
        }
    }
}