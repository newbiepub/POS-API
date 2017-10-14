import {Company} from "../models/company";
import {AccessToken} from "../models/accessToken";
import Crypto from "crypto-js";
import faker from "faker";
import * as _ from "lodash";

export function countCompany() {
    return new Promise((resolve, reject) => {
        Company.find().count((err, count) => {
            if (err) reject(err);
            else {
                resolve(count);
            }
        });
    })
}

export function createCompany(companyId, companySecret) {
    return new Promise((resolve, reject) => {
        let company = new Company({
            companyId,
            companySecret
        });
        company.save(err => {
            if (err) reject(err);
            else {
                resolve(company);
            }
        })
    })
}

export function loginCompany(companyId, companySecret) {
    return new Promise((resolve, reject) => {
        Company.findOne({companyId: companyId, companySecret: companySecret}).exec(function (err, company) {
            if (err) reject(err);
            else {
                if (company) {

                    AccessToken.findOne({companyId: company.companyId}).exec((err, accessToken) => {
                        if(err) reject(err);
                        else {
                            if(accessToken != undefined) {
                                Object.assign(accessToken, {
                                    access_token: Crypto.SHA256(faker.random.word()),
                                    refresh_token: Crypto.SHA256(faker.random.word()),
                                    companyId: company.companyId
                                });
                            } else {
                                accessToken = new AccessToken({
                                    access_token: Crypto.SHA256(faker.random.word()),
                                    refresh_token: Crypto.SHA256(faker.random.word()),
                                    companyId: company.companyId
                                });
                            }
                            accessToken.save((err) => {
                                if(err) reject(err);
                                else {
                                    resolve(_.pick(accessToken, ["_id", "access_token", "refresh_token"]));
                                }
                            })
                        }
                    })
                } else {
                    reject(new Error("Company not found"));
                }
            }
        })
    })
}