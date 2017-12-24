import {Schema} from "mongoose";
import db from "../db";

const CompanyProfile = new Schema({
    companyName: {type: String},
});

const CompanySchema = new Schema({
    companyEmail: {
        type: String,
        validate: {
            validator: function(v) {
                return (new RegExp(/^[a-z0-9A-Z]{1,}\@[a-z0-9A-Z]{1,}\.[a-z0-9A-Z]{1,}$/)).test(v);
            },
            message: '{VALUE} is not a valid email !'
        },
        required: true
    },
    companyProfile: {type: CompanyProfile, defaultValue: {}},
    companySecret: {type: String, required: true}
});

const Company = db.model("company", CompanySchema, "company");

export {Company};