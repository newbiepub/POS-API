import Router from "router";
import {Employee} from "../../../models/employee";

const employee = Router();

employee.get("/employee", async (req, res, next) => {
    try {
        let employees = await Employee.find({companyId: req.companyId}).exec();
        res.statusCode = 200;
        res.end(JSON.stringify(employees));
    } catch(e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Đã có lỗi xảy ra"}}));
    }
});

export default employee;