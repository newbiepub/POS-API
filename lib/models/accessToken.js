import {Schema} from "mongoose";
import db from "../db";
import {ttl} from "../utils/function";

const AccessTokenSchema = new Schema({
    access_token: {type: String, required: true},
    refresh_token: {type: String, required: true},
    ttl: {type: Number, default: ttl()},
    userId: {type: String},
    companyId: {type: String}
});

const AccessToken = db.model("access_token", AccessTokenSchema, 'access_token');

export {AccessToken};