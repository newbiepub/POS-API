import {Discount} from "../../../models/modelConfigs";

export const updateDiscount = async (discountId, updateItems) => {
    try {
        // Remove undefined fields
        updateItems = JSON.parse(JSON.stringify(updateItems));
        return await Discount.findOneAndUpdate({_id: discountId}, {
            $set: updateItems
        }, {
            new: true
        }).exec()
    } catch (e) {
        throw e;
    }
}