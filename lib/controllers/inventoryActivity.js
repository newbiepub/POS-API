import {InventoryActivity} from "../models/InventoryActivity";

export async function createProductImport(payload) {
    try {
        return await new InventoryActivity(payload).save();
    } catch(e) {
        throw e;
    }
}

export async function createIngredientImport(payload) {
    try {
        return await new InventoryActivity(payload).save();
    } catch (e) {
        throw e;
    }
}