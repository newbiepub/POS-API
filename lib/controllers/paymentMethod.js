import {PaymentMethod} from "../models/paymentMethod";

const initPaymentMethod = async () => {
    try {
        const paymentMethod = new PaymentMethod({});
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

export { initPaymentMethod, countPaymentMethod }