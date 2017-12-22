import Router from "router";
import {checkCompanyAuth} from "../../controllers/accessToken";
import account from "./apiHelper/account";

const api = Router();

api.use(async (req, res, next) => {
    res.setHeader("Content-Type", 'application/json');
    try {
        let access_token = req.query.access_token || req.body.access_token || req.headers["access-token"];
        if(access_token) {
            let token = await checkCompanyAuth({access_token});
            if(token) {
                req.companyId = token.companyId;
                return next();
            }
        }
        throw new Error("Token unhandled");
    } catch(e) {
        res.statusCode = 401;
        res.end(JSON.stringify({error: {message: "Unauthorized"}}))
    }
});

api.use("/account", account);

export default api;