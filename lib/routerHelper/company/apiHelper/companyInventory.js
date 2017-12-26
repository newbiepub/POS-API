import Router from "router";
import {getCompanyInventoryIngredient, getCompanyInventoryProduct} from "../../../controllers/inventory";
import {Ingredient} from "../../../models/ingredient";
import {Inventory} from "../../../models/inventory";

const inventory = Router();

inventory.get("/product", async (req, res, next) => {
    try {
        let companyId = req.companyId,
            product = await getCompanyInventoryProduct(companyId);
        res.statusCode = 200;
        res.end(JSON.stringify(product));
    } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: e.message}}));
    }
});

inventory.get("/ingredient", async (req, res, next) => {
    try {
        let employeeId = req.companyId,
            ingredient = await getCompanyInventoryIngredient(employeeId);
        res.statusCode = 200;
        res.end(JSON.stringify(ingredient));
    } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: e.message}}));
    }
});

inventory.post("/ingredient", async (req, res, next) => {
    try {
        let companyId = req.companyId,
            {name, description, quantity, price, unit} = req.body;

        let validator = !name.length ? "Yêu cầu tên nguyên liệu" : !unit ? "Yêu cầu đơn vị sản phẩm" : true;
        if (validator !== true) {
            res.statusCode = 405;
            return res.end(JSON.stringify({error: {message: validator}}));
        }

        let ingredient = await new Ingredient({
            companyId,
            name, description, unit, price
        }).save();

        await Inventory.update({companyId}, {$addToSet: {ingredient: {ingredientId: ingredient._id.toString(), quantity}}}).exec();
        res.statusCode = 200;
        res.end(JSON.stringify({success: true}));
    } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: e.message}}));
    }
});

inventory.put("/ingredient/:id", async (req, res, next) => {
    try {
        let companyId = req.companyId,
            {name, description, quantity, price, unit} = req.body;

        let validator = !name.length ? "Yêu cầu tên nguyên liệu" : !unit ? "Yêu cầu đơn vị sản phẩm" : true;
        if (validator !== true) {
            res.statusCode = 405;
            return res.end(JSON.stringify({error: {message: validator}}));
        }

        await Ingredient.update({_id: req.params.id}, {
            $set: {name, description, price, unit}
        }).exec();

        await Inventory.update({companyId}, {$pull: {ingredient: {ingredientId: req.params.id}}}).exec();
        await Inventory.update({companyId}, {$addToSet: {ingredient: {ingredientId: req.params.id, quantity}}}).exec();
        res.statusCode = 200;
        res.end(JSON.stringify({success: true}));
    } catch(e) {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: e.message}}));
    }
});

inventory.delete("/ingredient/:id", async (req, res, next) => {
    try {
        if(req.params.id) {
            await Inventory.update({companyId: req.companyId}, {$pull: {ingredient: {ingredientId: req.params.id}}}).exec();
            await Ingredient.remove({_id: req.params.id}).exec();
            res.statuscode = 200;
            res.end(JSON.stringify({success: true}));
        } else {
            res.statusCode = 405;
            res.end(JSON.stringify({error: {message: "Not allowed"}}));
        }
    }  catch(e) {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: e.message}}));
    }
});

export default inventory;