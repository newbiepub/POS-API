const _ = require("lodash");
import {Employee} from "../models/employee";
import user from "../routerHelper/user/user";

const findOneEmployee = async (query) => {
    try {
        let employee = Employee.findOne(query);
        employee = await employee.exec();
        if (employee != undefined) {
            return employee;
        } else {
            throw new Error("Employee Not Found");
        }
    } catch (e) {
        console.warn("error - findOneEmployee");
        throw e;
    }
};

const countEmployee = async () => {
    try {
        let employee = Employee.count();
        employee = await employee.exec();
        return employee;
    } catch (e) {
        console.log("error - countEmployee");
        throw e;
    }
};

const createEmployee = async (companyId, employeeProfile, username, password, role) => {
    try {
        let employee = new Employee({
            companyId,
            employeeProfile,
            username,
            password,
            role,
        });
        employee = await employee.save();
        return employee;
    } catch (e) {
        console.log("error - createEmployee");
        throw e;
    }
};

const getCurrentEmployee = async (userId) => {
    try {
        let currentUser = await Employee.findOne({_id: userId}).select({password: 0, role: 0}).exec();
        if(currentUser) {
            return currentUser;
        }
        throw new Error("User not found");
    } catch(e) {
        throw e;
    }
};

export {findOneEmployee, countEmployee, createEmployee, getCurrentEmployee};