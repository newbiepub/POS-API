import Router from "router";
import {Company} from "../../../models/company";
import {AccessToken} from "../../../models/accessToken";

const account = Router();

account.get("/currentCompany", async (req, res, next) => {
    try {
        let {companyId} = req;
        let currentCompany = await Company.findOne({_id: companyId}, {companySecret: false}).exec();
        res.statusCode = 200;
        res.end(JSON.stringify(currentCompany));
    } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Đã có lỗi xảy ra"}}));
    }
});

account.post("/logout", async (req, res, next) => {
   try {
        let { access_token } = req.body;
        await AccessToken.remove({access_token}).exec();
       res.statusCode = 200;
       res.end({success: true});
   } catch(e) {
       res.statusCode = 500;
       res.end(JSON.stringify({error: {message: "Đã có lỗi xảy ra"}}));
   }
});

export default account;