import {Schema} from "mongoose";
import db from "../db";

const ttl = () => {
    let today = new Date();
    let nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);
    return nextWeek.getTime();
};

const AccessTokenSchema = new Schema({
    access_token: {type: String, required: true},
    refresh_token: {type: String, required: true},
    ttl: {type: Number, default: ttl()},
    companyId: {type: String, required: true}
});

const AccessToken = db.model("access_token", AccessTokenSchema, 'access_token');

export {AccessToken};