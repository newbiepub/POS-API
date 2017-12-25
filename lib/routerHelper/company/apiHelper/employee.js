import Router from "router";
import {Employee} from "../../../models/employee";
import passwordHash from "password-hash";

const employee = Router();

employee.get("/", async (req, res, next) => {
    try {
        let employees = await Employee.find({companyId: req.companyId}, {password: false}).exec();
        res.statusCode = 200;
        res.end(JSON.stringify(employees));
    } catch(e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Đã có lỗi xảy ra"}}));
    }
});

employee.post("/", async (req, res, next) => {
    try {
        let { username, password, fund, name } = req.body;
        if(username && password) {
            if(password.length > 6) {
                res.statusCode = 405;
                return res.end(JSON.stringify({error: {message: "Mật khẩu phải có tối thiểu 6 kí tự"}}));
            }
            let countEmployee = await Employee.find({username}).count().exec();

            if(countEmployee) {
                res.statusCode = 405;
                return res.end(JSON.stringify({error: {message: "Tên đăng nhập đã tồn tại"}}));
            }

            // Create Employee
            await new Employee({
                username,
                password: passwordHash.generate(password),
                fund,
                employeeProfile: {name},
                companyId: req.companyId
            }).save();
            res.statusCode = 200;
            return res.end(JSON.stringify({success: true}));
        }
        res.statusCode = 405;
        res.end(JSON.stringify({error: {message: "Tên đăng nhập và mật khẩu không được để trống"}}));
    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Đã có lỗi xảy ra"}}));
    }
});

export default employee;