import PRODUCT from "./index";

const PRODUCT_MUTATION = {
    UPDATE_PRODUCT: async (obj, variables, context) => {
        try {
            await PRODUCT.UPDATE_PRODUCT(variables.productId);
            return {success: true};
        } catch (e) {
            throw e;
        }
    }
}

export { PRODUCT_MUTATION };