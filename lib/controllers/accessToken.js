import { AccessToken } from "../models/accessToken";
import {Company} from "../models/company";
import Crypto from "crypto-js";
import faker from "faker";
import * as _ from "lodash";
import {ttl} from "../utils/function";

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
                return accessToken;
            } else if(accessToken.refresh_token === refresh_token) {
                accessToken = await AccessToken.update({access_token}, {$set: {
                    access_token: Crypto.SHA256(faker.random.word()),
                    refresh_token: Crypto.SHA256(faker.random.word()),
                    userId: accessToken.userId,
                    ttl: ttl()
                }}).exec();
                return accessToken;
            }
        }
        throw new Error("Unauthorized");
    } catch(e) {
        console.log("error - checkAuthToken");
        console.log(e)
        throw e;
    }
}

export { createAuthToken, checkAuthToken }

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