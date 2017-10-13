import * as _ from "lodash";
import {Employee} from "../models/employee";

const findOneEmployee = async (query) => {
    try {
        let employee = Employee.findOne(query);
        employee = await employee.exec();
        if(employee != undefined) {
            return employee;
        } else {
            throw new Error("Employee Not Found");
        }
    } catch(e) {
        console.warn("error - findOneEmployee");
        throw e;
    }
};

const countEmployee = async () => {
    try {
        let employee = Employee.count();
        employee = await employee.exec();
        return employee;
    } catch(e) {
        console.log("error - countEmployee");
        throw e;
    }
};

export {findOneEmployee, countEmployee};