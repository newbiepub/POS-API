import {createDiscount} from "./methods/create";
import {fetchAllDiscount,fetchDiscountEmployee} from "./methods/fetch";
import {updateDiscount} from "./methods/update";

const DISCOUNT = {
    CREATE_DISCOUNT: createDiscount,
    UPDATE_DISCOUNT: updateDiscount,
    FETCH_DISCOUNT: fetchAllDiscount,
    FETCH_DISCOUNT_EMPLOYEE: fetchDiscountEmployee
}

export default DISCOUNT