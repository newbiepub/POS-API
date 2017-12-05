import {PaymentMethod} from "../models/paymentMethod";

const initPaymentMethod = async (id) => {
    try {
        const paymentMethod = new PaymentMethod({employeeId:id});
        return await paymentMethod.save();
    } catch (e) {
        throw e;
    }
};

const countPaymentMethod = async () => {
    try {
        const count = PaymentMethod.find({}).count();
        return await count.exec();
    } catch (e) {
        throw e;
    }
};
const getPaymentMethod= async (id) =>{
    try {
        const result = PaymentMethod.findOne({employeeId: id});
        return await result.exec();
    } catch (e) {
        throw e;
    }
}

export { initPaymentMethod, countPaymentMethod,getPaymentMethod }