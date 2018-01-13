import Router from "router";
import {Employee} from "../../../models/employee";
import passwordHash from "password-hash";

const employee = Router();

employee.get("/", async (req, res, next) => {
    try {
        let employees = await Employee.find({companyId: req.companyId}, {password: false}).exec();
        res.statusCode = 200;
        res.end(JSON.stringify(employees));
    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Đã có lỗi xảy ra"}}));
    }
});

employee.post("/", async (req, res, next) => {
    try {
        let {username, password, fund, name} = req.body;
        if (username && password) {
            if (password.length < 6) {
                res.statusCode = 405;
                return res.end(JSON.stringify({error: {message: "Mật khẩu phải có tối thiểu 6 kí tự"}}));
            }
            let countEmployee = await Employee.find({username}).count().exec();

            if (countEmployee) {
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

employee.put("/", async (req, res, next) => {
    try {
        let {username, password, fund, name, employeeId} = req.body,
            modifier = {$set: {
                username,
                fund: (fund && fund > 0) ? fund : 0,
                "employeeProfile.name": name ? name : ""
            }};
        if(!employeeId) {
            res.statusCode = 405;
            return res.end(JSON.stringify({error: {message: "Không tìm thấy POS"}}));
        }

        if(password) {
            if(password.length < 6) {
                res.statusCode = 405;
                return res.end(JSON.stringify({error: {message: "Mật khẩu phải có tối thiểu 6 kí tự"}}));
            } else {
                Object.assign(modifier["$set"], {
                    password: passwordHash.generate(password)
                });
            }
        }

        if (username) {

            let countEmployee = await Employee.find({username, _id: {$ne: employeeId}}).count().exec();

            if (countEmployee) {
                res.statusCode = 405;
                return res.end(JSON.stringify({error: {message: "Tên đăng nhập đã tồn tại"}}));
            }
            await Employee.update({_id: employeeId}, modifier).exec();

            res.statusCode = 200;
            return res.end(JSON.stringify({success: true}));
        }
        res.statusCode = 405;
        res.end(JSON.stringify({error: {message: "Tên Đăng nhập không được bỏ trống"}}));
    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Đã có lỗi xảy ra"}}));
    }
});

employee.post("/deactivate", async (req,res,next) => {
    try {
        let { employeeId } = req.body;
        if(employeeId) {
            await Employee.update({_id: employeeId}, {$set: {isActivate: false}})
        }
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Không tìm thấy POS"}}));
    } catch(e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Đã có lỗi xảy ra"}}));
    }
})

export default employee;