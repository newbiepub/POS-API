import {Schema} from "mongoose";
import db from "../db";

const CompanySchema = new Schema({
    companyId: String,
    companyProfile: Object,
    companySecret: String
});

const Company = db.model("company", CompanySchema, "company");

export {Company};