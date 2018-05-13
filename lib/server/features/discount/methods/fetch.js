import {Discount} from "../../../models/modelConfigs";

export const fetchAllDiscount = async () => {
    try {
        return await Discount.find().sort({createdAt: -1}).exec();
    } catch (e) {
        throw e;
    }
};
export const fetchDiscountEmployee = async (employeeId) => {
    try {
        return await Discount.find({employeeIds: employeeId}).exec();
    } catch (e) {
        throw e;
    }
};