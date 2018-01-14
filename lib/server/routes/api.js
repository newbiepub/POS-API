import express from "express";
import bodyParser from "body-parser";
import {graphqlExpress} from "apollo-server-express";
import rootResolver from "../resolvers/rootResolver";
import {checkUserAuth} from "../resolvers/accessToken";

const api = express.Router(); // Api Router

api.use(async (req, res, next) => {
    let access_token = req.headers["authentication"] || req.headers["x-auth-token"] || "",
        refresh_token = req.headers["x-refresh-token"] || "";
    if(access_token) {
        try {
            let token = await checkUserAuth(access_token, refresh_token),
                {user, roles} = token;
            req.user = Object.assign(user, {roles});
            return next();
        } catch(e) {
            return res.status(500).json({error: {message: e.message}});
        }
    } else {
        return res.status(401).json({error: {message: "Unauthorized"}});
    }
});

api.use("/", bodyParser.json(), graphqlExpress(req => {
    return {
        schema: rootResolver,
        context: {
            user: req.user
        },
        formatError: err => {
            if (err.originalError && err.originalError.error_message) {
                err.message = err.originalError.error_message;
            }
            return err;
        }
    }
}));

export default api;