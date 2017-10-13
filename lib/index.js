import {countEmployee} from "./controllers/employee";

require('dotenv').config();
import {createRole, rolesCount} from "./controllers/role";
import finalHandler from "finalhandler";
import http from "http";
import app from "./router";
import { countCompany, createCompany } from "./controllers/company";
import passwordHash from "password-hash";

const boot = async (app) => {
    try {
        let roleCount = await rolesCount();
        let roleAdmin = null,
            roleEmployee = null
        if(!roleCount) {
            let roleAdmin = await createRole("admin"),
            roleEmployee = await createRole("employee");
        }

        let employeeCount = await countEmployee();
        if(!employeeCount) {
        }
    } catch(e) {
        console.log("error - boot app");
        console.log(e);
    }
};

boot(app);

const server = http.createServer((req, res) => app(
    req, res, finalHandler(req, res)
));

server.listen((process.env.PORT || 3000), () => {
    console.log("App is running on http://localhost:" + (process.env.PORT || 3000));
});