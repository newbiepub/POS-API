import {addProduct} from "./methods/add";
import {addProductInventory} from "./methods/addToCompany";
import {addProductToPOS} from "./methods/addToPOS";

const PRODUCT = {
    ADD_PRODUCT: addProduct,
    ADD_PRODUCT_INVENTORY: addProductInventory,
    ADD_TO_POS: addProductToPOS
}

export default PRODUCT;