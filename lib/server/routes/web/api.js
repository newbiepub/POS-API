import express from 'express';
import {companyWebAuth} from "../../resolvers/accountWeb";
import bodyParser from 'body-parser';
import {graphqlExpress} from "apollo-server-express";
import rootResolver from "../../resolvers/rootResolver";
import {addPriceToArray, csvDataToJSON, logger} from "../../../utils/helpers";
import {productActivity} from "../../resolvers/inventory";
import {normalize_product} from "../../../utils/normalizeData/product";
import PRODUCT from "../../features/inventory/product/index";
import INVENTORY_HISTORY from "../../features/inventory/history/index";
import INVENTORY_ACTIVITY from "../../features/inventory/activity/index";

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
const importProduct = async (product, userId) => {
    // ADD PRODUCT
    // name = '', unit = '', description = '', category = '', companyId = '', productCode = ''
    let addedProduct = await PRODUCT.ADD_PRODUCT(product.name, product.unit, product.description, product.category, userId, product.productCode);
    // ADD TO COMPANY INVENTORY
    // product = null, importPrice = 0, prices = [], description = '',
    // quantity = 0, employeeId = undefined, companyId = undefined,
    return await PRODUCT.ADD_PRODUCT_INVENTORY(addedProduct._id, product.importPrice, product.prices,
        product.description, product.quantity, undefined, userId);
}
webApi.post("/company/inventory/import/csv", async (req, res, next) => {
    try {
        let { productData, fromProfile } = req.body, result, products = [], promises;

        productData = csvDataToJSON(productData); // Convert to product object
        products = productData.map(normalize_product);
        promises = products.map((product) => importProduct(product, req.user._id));
        await Promise.all(promises);
        logger('success', 'DONE IMPORT');
        // Create history
        // products = [], from = null, to = null, type = '',
        // dateDelivered = null, dateReceived = null
        // Logger
        await INVENTORY_ACTIVITY.CREATE_ACTIVITY_LOG(`IMPORTED_${products.length}_PRODUCT`, req.user._id, undefined, 'logger_import_product_to_company')
        // create inventory history
        await INVENTORY_HISTORY.CREATE_HISTORY(products, fromProfile, {_id: req.user._id},
            'import', new Date(), new Date());
        res.status(200).json({success: true});
    } catch (e) {
        res.status(500).json({errors: [{ message: e.message }]});
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