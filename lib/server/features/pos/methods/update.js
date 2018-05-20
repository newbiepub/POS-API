import {logger} from "../../../../utils/helpers";
import {User} from "../../../models/modelConfigs";

export const update = async (employeeId, username = '', password = '', name = '', address = '', phoneNumber = '') => {
    try {
        let updateItems = {
            username,
            password: password.length > 0 ? password : undefined,
            profile: {
                name,
                address,
                phoneNumber
            }
        }
        // Remove undefined property
        updateItems = JSON.parse(JSON.stringify(updateItems));
        logger('info', 'update user - ', employeeId);
        return await User.findOneAndUpdate({_id: employeeId}, {$set: updateItems}, {new: true}).exec();
    } catch (e) {
        throw e;
    }
}