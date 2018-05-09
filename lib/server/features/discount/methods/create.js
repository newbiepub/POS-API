import {Discount} from "../../../models/modelConfigs";

export const createDiscount = async (products, name, description, employeeIds, companyId,
                                     appliedDate, dueDate, type, value) => {
    try {
        let discount = await new Discount({
            products, description, employeeIds, companyId,
            appliedDate, dueDate, type, value, name
        }).save();
        return discount;
    } catch (e) {
        console.log(e.message);
    }
}