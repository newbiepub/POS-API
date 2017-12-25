import Router from "router";
import {getPOSInventory} from "../../../controllers/inventory";

const employeeInventory = Router();

employeeInventory.get("/employee/inventory", async (req, res, next) => {
    try {
        if(!req.query.employeeId) return res.end(JSON.stringify({error: {message: "Không thể lấy kho POS"}}));
        let inventory = await getPOSInventory(req.query.employeeId);
        res.statusCode = 200;
        res.end(JSON.stringify(inventory));
    } catch(e) {
        console.log(e);
        res.statusCode = 200;
        res.end(JSON.stringify({error: {message: "Đã có lỗi xảy ra"}}));
    }
});

export default employeeInventory;
