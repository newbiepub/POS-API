import express from 'express';
import {companyWebAuth} from "../../resolvers/accountWeb";
import bodyParser from 'body-parser';
import {graphqlExpress} from "apollo-server-express";
import rootResolver from "../../resolvers/rootResolver";
import {addPriceToArray, csvDataToJSON} from "../../../utils/helpers";
import {productActivity} from "../../resolvers/inventory";

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
    try {
        let { productData, fromProfile } = req.body, result;

        productData = csvDataToJSON(productData); // Convert to product object
        productData = await addPriceToArray(productData, "import", 'priceImport', 0); // Add import price to array
        productData = await  addPriceToArray(productData, 'default', 'priceSale', 0.3); // Add sale price to array
        result = await productActivity(fromProfile, {_id: req.user._id}, productData, 'import', req.user._id);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        res.json({errors: [{ message: e.message }]});
    }

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