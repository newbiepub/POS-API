import express from "express";
import {companyLogin, employeeLogin} from "../resolvers/account";

const account = express.Router();

account.post("/employee/login", async (req, res, next) => {
    try {
        let {username, password} = req.body;
        if (username && password) {
            let authToken = await employeeLogin(username, password);
            return res.status(200).json(authToken);
        }
        throw new Error("MISSING_USERNAME_AND_PASSWORD");
    } catch (e) {
        return res.status(500).json({error: {message: e.message}});
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
        res.status(500).json({error: {message: e.message}});
    }
});

export default account;