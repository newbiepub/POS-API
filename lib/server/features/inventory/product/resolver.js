import PRODUCT from "./index";

const PRODUCT_MUTATION = {
    UPDATE_PRODUCT: async (obj, variables, context) => {
        try {
            await PRODUCT.UPDATE_PRODUCT(variables.productId, variables.name, variables.quantity, variables.prices,
                variables.description, variables.unit, variables.productCode, context.user._id);
            return {success: true};
        } catch (e) {
            throw e;
        }
    }
}

export { PRODUCT_MUTATION };