import express from "express";
import {companyLogin, employeeLogin, exchangeToken} from "../resolvers/account";
import {companyWebLogin} from "../resolvers/accountWeb";

const account = express.Router();

account.post("/employee/login", async (req, res, next) => {
    try {
        let {username, password} = req.body;
        if (username && password) {
            console.log(username, password)
            let authToken = await employeeLogin(username, password);
            return res.status(200).json(authToken);
        }
        throw new Error("MISSING_USERNAME_AND_PASSWORD");
    } catch (e) {
        return res.status(500).json({errors: [{message: e.message}]});
    }
});

account.post("/company/login", async (req, res, next) => {
    try {
        let { email, password } = req.body;
        if(email && password) {
            let authToken = await companyLogin(email, password);
            return res.status(200).json(authToken);
        }
        throw new Error("MISSING_EMAIL_AND_PASSWORD");
    } catch (e) {
        res.status(500).json({errors: [{message: e.message}]});
    }
});

account.post('/token/exchanges', async (req, res, next) => {
    try {
        let { access_token, refresh_token } = req.body;
        let token = await exchangeToken(access_token, refresh_token);
        res.status(200).json(token);
    } catch (e) {
        next(e);
    }
});

account.post('/web/company/login', async (req, res, next) => {
    try {
        let { email, password } = req.body;
        if(!email && !password) {
            throw new Error("EMAIL_PASSWORD_REQUIRED");
        }
        let token = await companyWebLogin(email, password);
        res.status(200).json({token});
    } catch (e) {
        console.log(e);
        res.status(500).json({errors: [{message: e.message}]})
    }
});

export default account;