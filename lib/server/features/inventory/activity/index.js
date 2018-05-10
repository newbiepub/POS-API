import {exportProductToPOS} from "./methods/exportToPOS";
import {createActivityLog} from "./methods/logger/activity";

const INVENTORY_ACTIVITY = {
    EXPORT_PRODUCT_TO_POS: exportProductToPOS,
    // logger
    CREATE_ACTIVITY_LOG: createActivityLog
}

export default INVENTORY_ACTIVITY;