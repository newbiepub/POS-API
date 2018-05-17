import {createInventoryHistory} from "./methods/create";
import {getInventoryHistory} from "./methods/fetch";

const INVENTORY_HISTORY = {
    FETCH_HISTORY: getInventoryHistory,
    CREATE_HISTORY: createInventoryHistory
}

export default INVENTORY_HISTORY;