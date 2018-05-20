import {User} from "../../../models/modelConfigs";
import {logger} from "../../../../utils/helpers";

export const deactivate = async (employeeId) => {
    try {
        let user;

        user = await User.findOne({_id: employeeId}).exec();
        logger('info', 'update user - ', employeeId);
        if(user.status === 'activate') {
            user = await User.findOneAndUpdate({_id: employeeId}, {$set: {status: 'deactivate'}}, {new: true}).exec();
        } else {
            user = await User.findOneAndUpdate({_id: employeeId}, {$set: {status: 'activate'}}, {new: true}).exec();
        }
        return user;
    } catch (e) {
        throw e;
    }
}