import express from 'express';
import {companyWebAuth} from "../../resolvers/accountWeb";
import bodyParser from 'body-parser';
import {graphqlExpress} from "apollo-server-express";
import rootResolver from "../../resolvers/rootResolver";
import {csvDataToJSON} from "../../../utils/helpers";

const webApi = express.Router();
/**
 * Middleware for user authentication
 */
webApi.use(async (req, res, next) => {
    try {
        let token = req.headers["x-authentication"];
        let user = await companyWebAuth(token); // Authentication

        req.user = user; // Save User To Session
        next();
    } catch (e) {
        console.log("Error - ", e.message);
        res.status(500).json({errors: [{message: e.message}]});
    }
});

/**
 * Import Product To Inventory API
 */

webApi.post("/company/inventory/import/csv", async (req, res, next) => {
    let data = csvDataToJSON(req.body.data);
    console.log("DATA: ", data);
    res.status(200).json({data});
});

/**
 * GraphQL API
 */

webApi.use('/', bodyParser.json(), graphqlExpress(req => {
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

export default webApi;