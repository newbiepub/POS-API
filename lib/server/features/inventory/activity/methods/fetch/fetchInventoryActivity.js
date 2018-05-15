import {InventoryActivity} from "../../../../../models/modelConfigs";

export async function fetchInventoryActivityEmployee(employeeId,limit,skip)
{
    console.log(limit, skip);
    return await InventoryActivity.find({"to._id": employeeId}).sort({"dateRequest": -1}).limit(limit).skip(skip).exec()
}
export async function fetchInventoryActivityEmployeeAmount(employeeId)
{
    return await InventoryActivity.find({"to._id": employeeId}).count().exec()
}
