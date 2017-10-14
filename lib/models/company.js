import {Schema} from "mongoose";
import db from "../db";

const CompanySchema = new Schema({
    companyEmail: {
        type: String,
        validate: {
            validator: function(v) {
                return (/^[a-z0-9A-Z]{1,}\@[a-z0-9A-Z]{1,}\.[a-z0-9A-Z]{1,}$/).test(v);
            },
            message: '{VALUE} is not a valid email !'
        }
    },
    companyProfile: Object,
    companySecret: String
});

const Company = db.model("company", CompanySchema, "company");

export {Company};