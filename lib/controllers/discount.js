import {Discount} from "../models/discount";
export async function createDiscount(discount) {
    try {
        return await new Discount(discount).save();
    } catch (e) {
        throw e;
    }
}
export async function getDiscount(employeeId) {
    try {
        return await Discount.find({"employeeId": employeeId}).exec();
    } catch (e) {
        throw e;
    }
}
export async function upsertDiscount(discount){
    try{
        return await Discount.findOneAndUpdate({_id: discount._id}, {$set: discount}, {multi: true, upsert: true});
    }catch(e)
    {
        throw(e)
    }
}