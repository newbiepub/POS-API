import {createDiscount} from "./methods/create";
import {fetchAllDiscount,fetchDiscountEmployee} from "./methods/fetch";

const DISCOUNT = {
    CREATE_DISCOUNT: createDiscount,
    FETCH_DISCOUNT: fetchAllDiscount,
    FETCH_DISCOUNT_EMPLOYEE: fetchDiscountEmployee
}

export default DISCOUNT