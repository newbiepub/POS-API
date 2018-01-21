import {Roles, User} from "../models/modelConfigs";
import passwordHash from "password-hash";
import {createAuthToken} from "./accessToken";

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

export const addNewEmployee = async (username, password, name, address, phoneNumber, companyId) => {
    try {
        let employeeRole = await Roles.findOne({roleName: "employee"}).exec();

        if(employeeRole) {
            let checkUserExists = await User.findOne({username}).exec();
            if(checkUserExists) {
                throw new Error("User existed");
            }

            return await new User({
                username,
                password: passwordHash.generate(password),
                profile: {
                    name, address, phoneNumber
                },
                roles: [employeeRole._id.toString()],
                companyId
            }).save();

        }
        throw new Error("Internal Error");
    }
    catch(e) {
        console.warn("error - addNewPOS");
        throw e;
    }
};