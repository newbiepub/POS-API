import {exportProductToPOS} from "./methods/order/exportToPOS";
import {createActivityLog} from "./methods/logger/activity";
import {createInventoryOrder} from "./methods/order/createOrder";
import {confirmOrder} from "./methods/order/confirmOrder";
import {requestOrder} from "./methods/order/requestOrder";
import {revertOrder} from "./methods/order/revertOrder";
import {fetchLog} from "./methods/logger/fetchLog";
import {fetchInventoryActivityEmployee, fetchInventoryActivityEmployeeAmount} from './methods/fetch/fetchInventoryActivity';
import {fetchInventoryOrder} from "./methods/order/fetchOrder";

const INVENTORY_ACTIVITY = {
    EXPORT_PRODUCT_TO_POS: exportProductToPOS,
    CREATE_INVENTORY_ORDER: createInventoryOrder,
    CONFIRM_INVENTORY_ORDER: confirmOrder,
    REQUEST_INVENTORY_ORDER: requestOrder,
    REVERT_INVENTORY_ORDER: revertOrder,
    FETCH_LOGS: fetchLog,

    //FETCH
    FETCH_INVENTORY_ACTIVITY_COMPANY: fetchInventoryOrder,
    FETCH_INVENTORY_ACTIVITY_EMPLOYEE: fetchInventoryActivityEmployee,
    FETCH_INVENTORY_ACTIVITY_EMPLOYEE_AMOUNT: fetchInventoryActivityEmployeeAmount,
    // logger
    CREATE_ACTIVITY_LOG: createActivityLog
}

export default INVENTORY_ACTIVITY;