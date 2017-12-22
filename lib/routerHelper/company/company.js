import Router from "router";
import {Company} from "../../models/company";
import passwordHash from "password-hash";
import {checkCompanyAuth, createCompanyToken} from "../../controllers/accessToken";
import api from "./companyAPI";

const company = Router();

company.post("/login", async (req, res, next) => {
    try {
        res.setHeader("Content-Type", "application/json");
        let {email, password} = req.body;
        let company = await Company.findOne({companyEmail: email}).exec();
        if(company) {
            let passwordVerify = passwordHash.verify(password, company.companySecret);
            if(passwordVerify) {
                let token = await createCompanyToken(company._id);
                res.statusCode = 200;
                res.end(JSON.stringify(token));
            }
            res.statusCode = 401;
            res.end(JSON.stringify({error: {message: "Mật Khẩu Không Chính Xác"}}));
        }
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Không tìm thấy company"}}));
    } catch(e) {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Đăng nhập thất bại"}}));
    }
});

company.post('/auth', async (req, res, next) => {
    try {
        res.setHeader("Content-Type", "application/json");
        let auth = await checkCompanyAuth(req.body.token);
        res.end(JSON.stringify(auth));
    } catch(e) {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Đăng nhập thất bại"}}));
    }
});

company.use("/api", api);

export default company;