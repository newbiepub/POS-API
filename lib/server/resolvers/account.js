import {Roles, User} from "../models/modelConfigs";
import passwordHash from "password-hash";
import {createAuthToken} from "./accessToken";

export const getAllUser = async () => {
    try {
        return await User.find().exec();
    } catch (e) {
        throw e;
    }
};

export const getUserRoles = async (roles) => {
    try {
        return await Roles.find({_id: {$in: roles}}).exec();
    } catch (e) {
        throw e;
    }
};

export const employeeLogin = async (username, password) => {
    try {
        let currentUser = await User.findOne({username}).exec();
        if (currentUser) {
            let passwordVerify = passwordHash.verify(password, currentUser.password);
            if (passwordVerify) {
                return await createAuthToken(currentUser._id);
            }
            throw new Error("INCORRECT_PASSWORD");
        }
        throw new Error("INCORRECT_USERNAME");
    } catch (e) {
        throw e;
    }
};

export const companyLogin = async (email, password) => {
    try {
        let currentUser = await User.findOne({email}).exec();
        if (currentUser) {
            let passwordVerify = passwordHash.verify(password, currentUser.password);
            if (passwordVerify) {
                return await createAuthToken(currentUser._id);
            }
            throw new Error("INCORRECT_PASSWORD");
        }
        throw new Error("INCORRECT_EMAIL");
    } catch (e) {
        throw e;
    }
};