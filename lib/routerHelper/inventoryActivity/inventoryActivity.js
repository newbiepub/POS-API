import Router from "router";
import {createIngredientImport, createProductImport} from "../../controllers/inventoryActivity";

const inventoryActivity = Router();

inventoryActivity.post("/inventoryActivity/pos/import/product", async (req, res, next) => {
    try {
        let { exportProduct } = req.body;
        if(exportProduct.length) {
            await createProductImport({
                employeeId: req.userId,
                productItems: exportProduct
            })
        }
    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: e.message}}));
    }
});

inventoryActivity.post("/inventoryActivity/pos/import/ingredient", async (req, res, next) => {
    try {
        let { exportIngredient } = req.body;
        if(exportIngredient.length) {
            await createIngredientImport({
                employeeId: req.userId,
                ingredient: exportIngredient
            })
        }
    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: e.message}}));
    }
});

export default inventoryActivity;