import {Roles, User} from "../models/modelConfigs";

export const getAllUser = async () => {
    try {
        return await User.find().exec();
    } catch(e) {
        throw e;
    }
};

export const getUserRoles = async (roles) => {
    try {
        return await Roles.find({_id: {$in: roles}}).exec();
    } catch(e) {
        throw e;
    }
};