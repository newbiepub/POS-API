import { AccessToken } from "../models/accessToken";
import {Company} from "../models/company";
import Crypto from "crypto-js";
import faker from "faker";
import * as _ from "lodash";
import {ttl} from "../utils/function";
import {Employee} from "../models/employee";

const createCompanyToken = async (companyId) => {
    try {
        let token = {
            access_token: Crypto.SHA256(faker.random.word()).toString(),
            refresh_token: Crypto.SHA256(faker.random.word()).toString(),
            companyId,
            ttl: ttl()
        };
        await AccessToken.update({companyId}, {$set: token}, {upsert: true}).exec();
        return _.pick(token, ['access_token', 'refresh_token']);
    } catch (e) {
        console.log("Error - createCompanyToken");
        console.log(e);
        throw e;
    }
};

const checkCompanyAuth = async (token) => {
    try {
        let accessToken = await AccessToken.findOne({access_token: token.access_token}).exec();
        if(accessToken) {
            if(accessToken.ttl > Date.now()) {
                return accessToken;
            } else if (accessToken.refresh_token === token.refresh_token) {
                let token = {
                    access_token: Crypto.SHA256(faker.random.word()).toString(),
                    refresh_token: Crypto.SHA256(faker.random.word()).toString(),
                    ttl: ttl()
                };
                await AccessToken.update({companyId: accessToken.companyId}, {$set: token}).exec();
                return Object.assign(token, {companyId: accessToken.companyId});
            }
        }
        throw new Error("Unauthorized");
    } catch(e) {
        console.log("Error - checkCompanyAuth");
        console.log(e);
        throw e;
    }
};

const createAuthToken = async (userId) => {
    try {
        let accessToken = AccessToken.findOne({userId});
        accessToken = await accessToken.exec();
        let auth = null;
        if(accessToken != undefined) {
            Object.assign(accessToken, {
                access_token: Crypto.SHA256(faker.random.word()),
                refresh_token: Crypto.SHA256(faker.random.word()),
                userId: userId
            });
            auth = await accessToken.save();
        } else {
            auth = new AccessToken({
                access_token: Crypto.SHA256(faker.random.word()),
                refresh_token: Crypto.SHA256(faker.random.word()),
                userId: userId
            });
            auth = await auth.save();
        }
        return auth;
    } catch(e) {
        console.log("error - createAuthToken");
        console.log(e);
        throw e;
    }
};

const checkAuthToken = async (access_token, refresh_token) => {
    try {
        let accessToken = AccessToken.findOne({access_token});
        accessToken = await accessToken.exec();
        if(accessToken != undefined) {
            if(accessToken.ttl > (new Date()).getTime()) {
                let currentUser = await Employee.findOne({_id: accessToken.userId}).exec() || {};
                if(currentUser.isActivate) {
                    return accessToken;
                }
                throw new Error("Tài khoản đã bị khoá");
            } else if(accessToken.refresh_token === refresh_token) {
                accessToken = await AccessToken.update({access_token}, {$set: {
                    access_token: Crypto.SHA256(faker.random.word()),
                    refresh_token: Crypto.SHA256(faker.random.word()),
                    userId: accessToken.userId,
                    ttl: ttl()
                }}).exec();
                return accessToken;
            }
        } else {
            throw new Error("Unauthorized");
        }
    } catch(e) {
        console.log("error - checkAuthToken");
        console.log(e)
        throw e;
    }
};

const removeToken = async (access_token) => {
   try {
        return await AccessToken.remove({access_token}).exec();
   } catch(e) {
       throw e;
   }
};

export { createAuthToken, checkAuthToken, removeToken, createCompanyToken, checkCompanyAuth }

export function currentCompany(access_token) {
    return new Promise((resolve, reject) => {
        AccessToken.findOne({access_token: access_token, ttl: {$gt: new Date().getTime()}}).exec(function (err, accessToken) {
            if (err) reject(err);
            else {
                if(accessToken) {
                    Company.findOne({companyId: accessToken.companyId}).exec((err, company) => {
                        if(err) reject(err);
                        else {
                            if(company) {
                                resolve(_.pick(company, ["_id", "companyId"]));
                            } else {
                                reject(new Error("Company Not Found"));
                            }
                        }
                    })
                } else {
                    reject(new Error("Unauthorized"));
                }
            }
        })
    })
}
export function getUserId(access_token) {
    return new Promise((resolve, reject) => {
        AccessToken.findOne({access_token: access_token}).exec(function (err, accessToken) {
            if (err) reject(err);
            else {
                if(accessToken) {
                    resolve(accessToken.userId);
                } else {
                    reject(new Error("Unauthorized"));
                }
            }
        })
    })
}