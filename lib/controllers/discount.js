import {Discount} from "../models/discount";
export async function createDiscount(discount) {
    try {
        return await new Discount(discount).save();
    } catch (e) {
        throw e;
    }
}
export async function getDiscountForCompany(id) {
    try {
        return await Discount.find({"companyId": id}).exec();
    } catch (e) {
        throw e;
    }
}
export async function getDiscountForEmployee(companyId,employeeId) {
    try {
        return await Discount.find({"companyId": companyId,"employeeId._id": employeeId}).exec();
    } catch (e) {
        throw e;
    }
}
export async function removeById(id) {
    try {
        return await Discount.remove({"_id": id}).exec();
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