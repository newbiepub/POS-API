import {createCategory} from "./methods/create";
import {fetchAllCategory} from "./methods/fetchAll";
import {updateCategory} from "./methods/update";

export const CATEGORY = {
    CREATE_CATEGORY: createCategory,
    UPDATE_CATEGORY: updateCategory,
    FETCH_CATEGORY: fetchAllCategory
}