import {InventoryActivity} from "../models/InventoryActivity";
import * as _ from "lodash";
import {Employee} from "../models/employee";
import {ProductController} from "./product";

export async function createImport(payload) {
    try {
        return await InventoryActivity.update({
            employeeId: payload.employeeId,
            type: payload.type
        }, {$set: _.omit(payload, ["employeeId", "type"])}, {upsert: true}).exec();
    } catch (e) {
        throw e;
    }
}

export async function getInventoryActivity() {
    try {
        let inventoryActivity = await InventoryActivity.aggregate([
            {
                $group: {
                    _id: {
                        date: {$dayOfMonth: {"$add": ["$createdAt", 7 * 60 * 60 * 1000]}},
                        month: {$month: {"$add": ["$createdAt", 7 * 60 * 60 * 1000]}},
                        year: {$year: {"$add": ["$createdAt", 7 * 60 * 60 * 1000]}}
                    },
                    inventoryActivity: {
                        $push: {
                            type: "$type",
                            createdAt: "$createdAt",
                            employeeId: "$employeeId",
                            productItems: "$productItems",
                            ingredient: "$ingredient",
                            done: "$done",
                            processing: "$processing"
                        }
                    }
                }
            }
        ]).exec(),
            promise = [];
        _.each(inventoryActivity, (item) => {
            for(let activity of item.inventoryActivity) {
                promise.push(new Promise(async (resolve, reject) => {
                    activity.employee = await Employee.findOne({_id: activity.employeeId}).exec();
                    resolve()
                }));
            }
        });
        await Promise.all(promise);
        return inventoryActivity;
    } catch (e) {
        throw e;
    }
}