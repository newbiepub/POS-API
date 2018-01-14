import express from "express";
import {employeeLogin} from "../resolvers/account";

const account = express.Router();

account.post("/employee/login", async (req, res, next) => {
    try {
        let {username, password} = req.body;
        if(username && password) {
            let authToken = await employeeLogin(username, password);
            return res.status(200).json(authToken);
        }
        throw new Error("MISSING_USERNAME_AND_PASSWORD");
    } catch(e) {
        return res.status(500).json({error: {message: e.message}});
    }
});

export default account;