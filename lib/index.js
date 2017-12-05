import {countEmployee, createEmployee} from "./controllers/employee";
import {createRole, rolesCount} from "./controllers/role";
import finalHandler from "finalhandler";
import http from "http";
import app from "./router";
import {countCompany, createCompany} from "./controllers/company";
import passwordHash from "password-hash";
import {countPaymentMethod, initPaymentMethod} from "./controllers/paymentMethod";
import {countPaymentStatus, initPaymentStatus} from "./controllers/paymentStatus";
import faker from "faker";
import {Product} from "./models/product";
import {Inventory} from "./models/inventory";
import {Category} from "./models/category";
import * as _ from "lodash";
import {Employee} from "./models/employee";

require('dotenv').config();

const boot = async (app) => {
    try {
        let roleCount = await rolesCount();
        let roleAdmin = null,
            roleEmployee = null;
        if (!roleCount) {
            roleAdmin = await createRole("admin");
            roleEmployee = await createRole("employee");
        }

        let companyCount = await countCompany();
        let company = null;
        if (!companyCount) {
            company = await createCompany("lam@example.com", passwordHash.generate("123456"))
        }

        let employeeCount = await countEmployee();
        if (!employeeCount) {
            let employee = await createEmployee(
                company._id.toString(),
                {},
                "lamnguyen2306",
                passwordHash.generate("123456"),
                roleEmployee._id.toString());
        }


        let categoryCount = await Category.find().count().exec(),
            productCount = await Product.find().count().exec(),
            inventoryCount = await Inventory.find().count().exec(),
            user = await Employee.findOne().exec();

        let paymentMethodCount = await countPaymentMethod();
        if (!paymentMethodCount) {
            await initPaymentMethod(user._id.toString());
        }

        let paymentStatusCound = await countPaymentStatus();
        if (!paymentStatusCound) {
            await initPaymentStatus(user._id.toString());
        }

        if(!parseInt(categoryCount)) {
            for(let i = 0; i < 10; i++) {
                await new Category({
                    name: faker.commerce.product(),
                    employeeId: user._id.toString()
                }).save();
            }
        }
        // Initial Product and Inventory

        if(!productCount && !inventoryCount) {
            let productItems = [],
                category = await Category.find().exec();
            for(let i = 0 ; i < 100; i++) {
                let product = {
                    name: faker.commerce.productName(),
                    price: faker.commerce.price(),
                    unit: "cái",
                    employeeId: user._id.toString(),
                    description: faker.lorem.sentence(),
                    detail: {},
                    categoryId: category[_.random(0, 9)]._id.toString()
                };
                let item = await new Product(product).save();
                productItems.push(item);
            }
            await new Inventory({
                productItems: _.map(productItems, (item) => {
                    return {productId: item._id}
                }),
                employeeId: user._id.toString(),
                isProduct: true
            }).save()
        }

    } catch (e) {
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