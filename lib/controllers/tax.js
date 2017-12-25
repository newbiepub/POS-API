import {Tax} from "../models/tax";
import * as _ from "lodash";

class TaxController {
    static async createTax(tax) {
        try {
            return await new Tax(tax).save();
        } catch(e) {
            throw e;
        }
    }
    static async currentTax(id) {
        try {
            let currentTax =  await Tax.findOne({"companyId": id}).sort({"createAt": -1}).exec();
            if(currentTax != null )
            {
                return currentTax.tax
            }else{
                return 0
            }

        } catch(e) {
            throw e;
        }
    }
    static async getTaxHistory(id) {
        try {
            return await Tax.find({"companyId": id}).sort({"createAt": -1}).limit(10).exec();
        } catch(e) {
            throw e;
        }
    }
}

export {TaxController};