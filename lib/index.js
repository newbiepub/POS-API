require('dotenv').config();
import finalHandler from "finalhandler";
import http from "http";
import app from "./router";
import { countCompany, createCompany } from "./controllers/company";
import Crypto  from "crypto-js";
import faker from 'faker';

const boot = async (app) => {
    try {
        let counter = await countCompany();
        if(!counter) {
            let companyId = faker.random.number(),
                companySecret = Crypto.SHA256(`pos${companyId}`);
            createCompany(companyId, companySecret);
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