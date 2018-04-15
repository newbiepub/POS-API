import {User} from "../models/modelConfigs";
import passwordHash from "password-hash";
import jwt from "jsonwebtoken";
import {logger} from "../../utils/helpers";

function createJWT (userId) {
    let options = {
        exp: Math.floor(Date.now() / 1000) + (60 * 30),
        data: {
            userId
        }
    };
    // jwt(options, secret) - sign jwt for token-based authentication
    return jwt.sign(options, process.env.JWT_SECRET);
}

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        throw e;
    }
}

export async function companyWebLogin(email, password) {
    try {
        // Get current User
        let currentUser = await User.findOne({email}).exec();
        if(currentUser) {
            // Password verification
            let passwordVerify = passwordHash.verify(password, currentUser.password);
            if(passwordVerify) {
                return createJWT(currentUser._id.toString());
            }
            throw new Error("INCORRECT_PASSWORD");
        }
        throw new Error("INCORRECT_EMAIL");
    } catch (e) {
        throw e;
    }
}

export async function companyWebAuth (token) {
    try {
        let { data = {} } = verifyToken(token);

        if(!!data.userId) {
            let user = await User.findOne({_id: data.userId}, {password: false}).exec();
            logger('info', 'CURRENT WEB USER - \n', user);
            if(!!user) {
                return user;
            }
            throw new Error("USER_NOT_FOUND");
        }
        throw new Error("UNAUTHORIZED_TOKEN");
    } catch (e) {
        throw e;
    }
}