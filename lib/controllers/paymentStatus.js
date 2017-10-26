import {PaymentStatus} from "../models/paymentStatus";

const initPaymentStatus = async () => {
    try {
        const paymentStatus = new PaymentStatus({});
        return await paymentStatus.save();
    } catch (e) {
        throw e;
    }
};

const countPaymentStatus = async () => {
    try {
        const count = PaymentStatus.find({}).count();
        return await count.exec();
    } catch (e) {
        throw e;
    }
};

export { initPaymentStatus, countPaymentStatus }