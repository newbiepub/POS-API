import {Schema} from "mongoose";
import db from "../db";

const CompanyProfile = new Schema({
    companyName: {type: String},
});

const CompanySettingSchema = new Schema({
    exportInventoryProductQuantity: {type: Number, defaultValue: 0, min: 0},
    exportInventoryIngredientQuantity: {type: Number, defaultValue: 0, min :0},
    exportProductCriteria: {type: Number, defaultValue: 0, min: 0},
    exportIngredientCriteria: {type: Number, defaultValue: 0, min: 0},
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
    companySecret: {type: String, required: true},
    settings: {
        type: CompanySettingSchema,
        defaultValue: {}
    }
});

const Company = db.model("company", CompanySchema, "company");

export {Company};