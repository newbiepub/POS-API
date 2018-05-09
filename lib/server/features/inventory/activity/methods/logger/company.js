import {InventoryActivityLogger} from "../../../../../models/modelConfigs";

const normalize_data = (data) => {
    return {
        _id: data._id,
        quantity: data.quantity,
    }
}

const importProductToCompany = async (data, companyId, message) => {
    try {
        data = normalize_data(data);
        return await new InventoryActivityLogger({
            companyId,
            data: JSON.stringify(data),
            type: 'logger_import_product_to_company'
        })
    } catch (e) {
        throw e;
    }
}

export { importProductToCompany }