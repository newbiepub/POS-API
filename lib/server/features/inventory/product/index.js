import {addProduct} from "./methods/add";
import {addProductInventory} from "./methods/addToCompany";
import {addProductToPOS} from "./methods/addToPOS";
import {updateProduct} from "./methods/update";

const PRODUCT = {
    ADD_PRODUCT: addProduct,
    ADD_PRODUCT_INVENTORY: addProductInventory,
    ADD_TO_POS: addProductToPOS,
    UPDATE_PRODUCT: updateProduct
}

export default PRODUCT;