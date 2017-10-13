import { AccessToken } from "../models/accessToken";
import {Company} from "../models/company";
import * as _ from "lodash";

const createAuthToken = async (userId) => {
    try {
        let auth = new AccessToken({userId});
        auth = await auth.exec();
        return auth;
    } catch(e) {
        console.log("error - createAuthToken");
        throw e;
    }
};

export { createAuthToken }

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