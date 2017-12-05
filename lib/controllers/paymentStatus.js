import {PaymentStatus} from "../models/paymentStatus";

const initPaymentStatus = async (id) => {
    try {
        const paymentStatus = new PaymentStatus({employeeId:id});
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
const getPaymentStatus= async (id) =>{
    try {
        const result = PaymentStatus.findOne({employeeId: id});
        return await result.exec();
    } catch (e) {
        throw e;
    }
}
export { initPaymentStatus, countPaymentStatus,getPaymentStatus }